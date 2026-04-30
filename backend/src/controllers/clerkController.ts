import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../config/prisma.js";

const TYPE = {
  USER: {
    CREATE: "user.created",
    DELETE: "user.deleted",
    UPDATE: "user.updated",
  },
  PAYMENT: {
    UPDATE: "paymentAttempt.updated",
  },
} as const;

const PLAN_CREDITS: Record<string, number> = {
  pro: 80,
  ultra: 400,
};

export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);
    const { data, type } = evt;

    switch (type) {
      // ─────────────────────────────
      // USER CREATED (use UPSERT only)
      // ─────────────────────────────
      case TYPE.USER.CREATE: {
        await prisma.user.upsert({
          where: { id: data.id },
          create: {
            id: data.id,
            email: data?.email_addresses?.[0]?.email_address ?? "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" "),
            image: data?.image_url ?? "",
            plan: "free",
            credits: 10,
          },
          update: {
            email: data?.email_addresses?.[0]?.email_address ?? "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" "),
            image: data?.image_url ?? "",
          },
        });
        break;
      }

      // ─────────────────────────────
      // USER DELETED
      // ─────────────────────────────
      case TYPE.USER.DELETE: {
        await prisma.user.delete({
          where: { id: data.id },
        });
        break;
      }

      // ─────────────────────────────
      // PAYMENT UPDATED
      // ─────────────────────────────
      case TYPE.PAYMENT.UPDATE: {
        const isPaid =
          (data.charge_type === "recurring" ||
            data.charge_type === "checkout") &&
          data.status === "paid";

        const planSlug = data?.subscription_items?.[0]?.plan?.slug;
        const clerkUserId = data?.payer?.user_id;
        const creditsToAdd = planSlug ? PLAN_CREDITS[planSlug] : undefined;

        if (isPaid && planSlug && clerkUserId && creditsToAdd) {
          await prisma.user.update({
            where: { id: clerkUserId },
            data: {
              credits: { increment: creditsToAdd },
              plan: planSlug,
            },
          });
        } else if (isPaid) {
          console.error("Invalid payment webhook data:", {
            planSlug,
            clerkUserId,
            creditsToAdd,
          });

          return res.status(400).json({
            message: "Invalid payment data",
          });
        }

        break;
      }

      default: {
        console.log("Unhandled webhook type:", type);
        break;
      }
    }

    return res.status(200).json({
      message: `Webhook processed: ${type}`,
    });
  } catch (err: any) {
    console.error("Clerk webhook error:", err);

    return res.status(500).json({
      message: err?.message || "Internal Server Error",
    });
  }
};
