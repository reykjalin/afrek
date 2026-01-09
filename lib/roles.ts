import type { Roles } from "@/types/globals";

// Server-side role checks are not directly available from WorkOS.
// Roles are stored in Convex, so these functions are deprecated.
// Use client-side useIsAdmin() hook or check roles via Convex queries.

export async function checkRole(_role: Roles): Promise<boolean> {
  // Role checking must be done via Convex - this is a stub
  // Use the useIsAdmin() hook on the client side
  return false;
}

export async function isAdmin(): Promise<boolean> {
  return checkRole("admin");
}
