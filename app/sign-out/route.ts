import { signOut } from "@workos-inc/authkit-nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? undefined;
  return signOut({ returnTo });
}
