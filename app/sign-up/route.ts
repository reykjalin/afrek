import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("returnTo");
  const state = returnTo
    ? btoa(JSON.stringify({ returnPathname: returnTo }))
    : undefined;
  const signUpUrl = await getSignUpUrl({ state });
  redirect(signUpUrl);
}
