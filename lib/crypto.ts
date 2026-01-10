const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const ENCRYPTION_VERSION = 1;

const PRF_SALT = encoder.encode("afrek-encryption-v1");

export interface EncryptedBlob {
  v: number;
  iv: string; // base64
  ciphertext: string; // base64
}

export interface EncryptedTaskPayload {
  titleJson: string;
  notesJson: string;
  tags: string[];
}

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function toBase64Url(buf: ArrayBuffer): string {
  return toBase64(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(b64url: string): ArrayBuffer {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return fromBase64(b64);
}

export async function encryptJson(
  key: CryptoKey,
  data: unknown
): Promise<EncryptedBlob> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = encoder.encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  );

  return {
    v: ENCRYPTION_VERSION,
    iv: toBase64(iv.buffer),
    ciphertext: toBase64(ciphertext),
  };
}

export async function decryptJson<T>(
  key: CryptoKey,
  blob: EncryptedBlob
): Promise<T> {
  if (blob.v !== ENCRYPTION_VERSION) {
    throw new Error("Unsupported encryption version");
  }
  const iv = new Uint8Array(fromBase64(blob.iv));
  const ciphertext = fromBase64(blob.ciphertext);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return JSON.parse(decoder.decode(plaintext)) as T;
}

async function importKeyFromPrfResult(prfResult: ArrayBuffer): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    prfResult,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export function isPrfSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof PublicKeyCredential !== "undefined" &&
    typeof navigator.credentials !== "undefined"
  );
}

export interface PasskeyRegistrationResult {
  credentialId: string; // base64url
  key: CryptoKey;
}

export async function registerPasskeyWithPrf(
  userId: string
): Promise<PasskeyRegistrationResult> {
  if (!isPrfSupported()) {
    throw new Error("Passkeys are not supported in this browser");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: "Afrek",
        id: window.location.hostname,
      },
      user: {
        id: encoder.encode(userId),
        name: `afrek-encryption-${userId.slice(0, 8)}`,
        displayName: "Afrek Encryption Key",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 }, // ES256
        { type: "public-key", alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
      extensions: {
        prf: {},
      },
    },
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error("Passkey registration was cancelled");
  }

  // Check if PRF is supported by this authenticator
  const prfEnabled = (credential.getClientExtensionResults() as { prf?: { enabled?: boolean } })?.prf?.enabled;
  if (!prfEnabled) {
    throw new Error(
      "Your authenticator does not support the PRF extension required for encryption. Please use a hardware security key like a YubiKey."
    );
  }

  const credentialId = toBase64Url(credential.rawId);

  // Now get the PRF result by authenticating with the new credential
  const { key } = await authenticatePasskeyWithPrf(credentialId);

  return { credentialId, key };
}

export interface PasskeyAuthResult {
  key: CryptoKey;
  credentialId: string;
}

export async function authenticateWithExistingPasskey(): Promise<PasskeyAuthResult> {
  if (!isPrfSupported()) {
    throw new Error("Passkeys are not supported in this browser");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = (await navigator.credentials.get({
    publicKey: {
      challenge,
      userVerification: "preferred",
      extensions: {
        prf: {
          eval: {
            first: PRF_SALT,
          },
        },
      },
    },
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error("Passkey authentication was cancelled");
  }

  const prfResults = (credential.getClientExtensionResults() as { prf?: { results?: { first?: ArrayBuffer } } })?.prf?.results;
  if (!prfResults?.first) {
    throw new Error(
      "This passkey does not support the PRF extension required for encryption. Please use a hardware security key like a YubiKey, or create a new passkey."
    );
  }

  const key = await importKeyFromPrfResult(prfResults.first);
  const credentialId = toBase64Url(credential.rawId);
  return { key, credentialId };
}

export async function authenticatePasskeyWithPrf(
  credentialId: string
): Promise<Omit<PasskeyAuthResult, "credentialId">> {
  if (!isPrfSupported()) {
    throw new Error("Passkeys are not supported in this browser");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));

  const credential = (await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [
        {
          id: fromBase64Url(credentialId),
          type: "public-key",
        },
      ],
      userVerification: "preferred",
      extensions: {
        prf: {
          eval: {
            first: PRF_SALT,
          },
        },
      },
    },
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error("Passkey authentication was cancelled");
  }

  const prfResults = (credential.getClientExtensionResults() as { prf?: { results?: { first?: ArrayBuffer } } })?.prf?.results;
  if (!prfResults?.first) {
    throw new Error(
      "PRF result not available. Your authenticator may not support the PRF extension."
    );
  }

  const key = await importKeyFromPrfResult(prfResults.first);
  return { key };
}

export async function createKeyCheck(key: CryptoKey): Promise<string> {
  const blob = await encryptJson(key, { check: "afrek-ok" });
  return JSON.stringify(blob);
}

export async function verifyKeyCheck(
  key: CryptoKey,
  keyCheck: string
): Promise<boolean> {
  try {
    const blob: EncryptedBlob = JSON.parse(keyCheck);
    const data = await decryptJson<{ check: string }>(key, blob);
    return data.check === "afrek-ok";
  } catch {
    return false;
  }
}
