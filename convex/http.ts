import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

// Clerk user webhook endpoint
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request, "CLERK_WEBHOOK_SECRET");
    if (!event) {
      return new Response("Invalid webhook signature", { status: 400 });
    }

    switch (event.type) {
      case "user.created":
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }

      default:
        console.log("Ignored Clerk user webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

// Clerk billing webhook endpoint
http.route({
  path: "/clerk-billing-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(
      request,
      "CLERK_BILLING_WEBHOOK_SECRET",
    );
    if (!event) {
      return new Response("Invalid webhook signature", { status: 400 });
    }

    if (!isSubscriptionItemEvent(event)) {
      return new Response("Unexpected webhook type received", { status: 400 });
    }

    const subscriptionItem = event.data;

    const clerkUserId = subscriptionItem.payer.user_id;

    switch (event.type) {
      case "subscriptionItem.active": {
        // Subscription became active (new subscription or trial started)

        await ctx.runMutation(internal.users.activateSubscription, {
          clerkUserId,
          planId: subscriptionItem.plan_id,
          planSlug: subscriptionItem.plan.slug,
          subscriptionId: subscriptionItem.subscription_id,
          subscriptionItemId: subscriptionItem.id,
          isTrial: subscriptionItem.is_free_trial === true,
        });
        break;
      }

      case "subscriptionItem.ended": {
        // Subscription ended (cancelled or expired)

        await ctx.runMutation(internal.users.endSubscription, {
          clerkUserId,
          planSlug: subscriptionItem.plan.slug,
        });
        break;
      }

      case "subscriptionItem.freeTrialEnding": {
        // Trial ending in 3 days

        await ctx.runMutation(internal.users.updateTrialEnding, {
          clerkUserId,
        });
        break;
      }

      default:
        console.log("Ignored Clerk billing webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

// Validate webhook request using svix
async function validateRequest(
  req: Request,
  secretEnvVar: string,
): Promise<WebhookEvent | null> {
  const secret = process.env[secretEnvVar];
  if (!secret) {
    console.error(`Missing ${secretEnvVar} environment variable`);
    return null;
  }

  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const wh = new Webhook(secret);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSubscriptionItemEvent(event: any): event is SubscriptionItemEvent {
  if ("type" in event === false) return false;
  if (typeof event.type !== "string") return false;
  if (!event.type.startsWith("subscriptionItem")) return false;

  const hasData = "data" in event;
  if (!hasData) return false;

  const data = event.data;

  const hasExpectedProps =
    "id" in data &&
    "subscription_id" in data &&
    "plan_id" in data &&
    "plan" in data &&
    "status" in data &&
    "payer" in data;
  if (!hasExpectedProps) return false;

  if (typeof data.id !== "string") return false;
  if (typeof data.subscription_id !== "string") return false;
  if (typeof data.plan_id !== "string") return false;
  if (typeof data.status !== "string") return false;

  if (typeof data.plan !== "object") return false;
  if ("slug" in data.plan === false) return false;
  if (typeof data.plan.slug !== "string") return false;

  if (typeof data.payer !== "object") return false;
  if ("user_id" in data.payer === false) return false;
  if (typeof data.payer.user_id !== "string") return false;

  return true;
}

// Type for subscription item events from Clerk billing
interface SubscriptionItemEvent {
  data: {
    type:
      | "subscriptionItem.active"
      | "subscriptionItem.ended"
      | "subscriptionItem.freeTrialEnding";
    id: string;
    subscription_id: string;
    plan_id: string;
    status:
      | "abandoned"
      | "active"
      | "canceled"
      | "ended"
      | "incomplete"
      | "past_due"
      | "upcoming";
    plan: {
      slug: string;
    };
    is_free_trial?: boolean;
    payer: {
      user_id: string;
    };
  };
}

export default http;
