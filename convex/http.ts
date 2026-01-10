import { createDodoWebhookHandler } from "@dodopayments/convex";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";

import { authKit } from "./auth";

const TRIAL_PERIOD_DAYS = 30;

const http = httpRouter();

authKit.registerRoutes(http);

http.route({
  path: "/dodopayments-webhook",
  method: "POST",
  handler: createDodoWebhookHandler({
    onSubscriptionActive: async (ctx, payload) => {
      console.log("🎉 Subscription Activated!");
      const userId = payload.data.metadata?.userId as string | undefined;
      const subscriptionId = payload.data.subscription_id;
      const customerId = payload.data.customer?.customer_id;
      const customerEmail = payload.data.customer?.email;
      const trialPeriodDays = payload.data.trial_period_days;

      if (userId && subscriptionId) {
        await ctx.runMutation(internal.subscriptions.activateByUserId, {
          userId,
          subscriptionId,
          dodoCustomerId: customerId || "",
        });

        if (trialPeriodDays && trialPeriodDays > 0 && customerEmail) {
          await ctx.runMutation(internal.trialEmails.recordTrialEmail, {
            email: customerEmail,
          });
          console.log(`📝 Recorded trial email: ${customerEmail}`);
        }
      } else {
        console.warn("Missing userId in metadata or subscriptionId:", {
          userId,
          subscriptionId,
        });
      }
    },

    onSubscriptionCancelled: async (ctx, payload) => {
      console.log("❌ Subscription Cancelled");
      const subscriptionId = payload.data.subscription_id;

      if (subscriptionId) {
        await ctx.runMutation(internal.subscriptions.cancelBySubscriptionId, {
          subscriptionId,
        });
      } else {
        console.warn("Missing subscriptionId for cancellation");
      }
    },

    onSubscriptionExpired: async (ctx, payload) => {
      console.log("⏰ Subscription Expired");
      const subscriptionId = payload.data.subscription_id;

      if (subscriptionId) {
        await ctx.runMutation(internal.subscriptions.cancelBySubscriptionId, {
          subscriptionId,
        });
      } else {
        console.warn("Missing subscriptionId for expiration");
      }
    },

    onPaymentSucceeded: async (ctx, payload) => {
      console.log("💰 Payment Succeeded:", payload.data.payment_id);
    },
  }),
});

export default http;
