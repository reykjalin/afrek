"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { authKit } from "./auth";

export const deleteMyAccount = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.runQuery(internal.users.getByExternalId, {
      externalId: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Cancel subscription in Dodo Payments if active
    if (user.plan?.subscription?.id) {
      const apiKey = process.env.DODO_PAYMENTS_API_KEY;
      const environment = process.env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode";

      if (apiKey) {
        const baseUrl =
          environment === "live_mode"
            ? "https://live.dodopayments.com"
            : "https://test.dodopayments.com";

        try {
          const response = await fetch(
            `${baseUrl}/subscriptions/${user.plan.subscription.id}`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "cancelled",
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to cancel subscription:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error cancelling subscription:", error);
        }
      }
    }

    // Delete user data (tasks and user record)
    await ctx.runMutation(internal.users.deleteUserData, {
      externalId: identity.subject,
    });

    // Delete user from WorkOS
    try {
      await authKit.workos.userManagement.deleteUser(identity.subject);
    } catch (error) {
      console.error("Failed to delete user from WorkOS:", error);
    }
  },
});
