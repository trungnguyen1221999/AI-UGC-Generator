import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

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
  // Express 5 will catch any error thrown here (including signature verification failures)
  const evt = await verifyWebhook(req);
  const { data, type } = evt;

  switch (type) {
    case TYPE.USER.CREATE: {
      await prisma.user.upsert({
        where: { id: data.id as string },
        create: {
          id: data.id as string,
          email: (data as any)?.email_addresses?.[0]?.email_address ?? "",
          name: [data.first_name, data.last_name].filter(Boolean).join(" "),
          image: (data as any)?.image_url ?? "",
          plan: "free",
          credits: 10,
        },
        update: {
          email: (data as any)?.email_addresses?.[0]?.email_address ?? "",
          name: [data.first_name, data.last_name].filter(Boolean).join(" "),
          image: (data as any)?.image_url ?? "",
        },
      });
      break;
    }

    case TYPE.USER.DELETE: {
      await prisma.user.delete({
        where: { id: data.id as string },
      });
      break;
    }

    case TYPE.PAYMENT.UPDATE: {
      const payload = data as any;
      const isPaid =
        (payload.charge_type === "recurring" ||
          payload.charge_type === "checkout") &&
        payload.status === "paid";

      const planSlug = payload?.subscription_items?.[0]?.plan?.slug;
      const clerkUserId = payload?.payer?.user_id;
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
        throw new AppError("Invalid payment webhook data", 400);
      }
      break;
    }

    default:
      console.log("Unhandled webhook type:", type);
      break;
  }

  return res.status(200).json({
    message: `Webhook processed: ${type}`,
  });
};
