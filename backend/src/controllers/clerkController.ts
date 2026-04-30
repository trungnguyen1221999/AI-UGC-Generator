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

// Credits added per plan on successful payment
// Số credit được cộng thêm mỗi lần thanh toán thành công
const PLAN_CREDITS: Record<string, number> = {
  pro: 80,
  ultra: 400,
};

export const handleClerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);
    const { data, type } = evt;

    switch (type) {
      case TYPE.USER.CREATE: {
        await prisma.user.create({
          data: {
            id: data.id,
            email: data?.email_addresses?.[0]?.email_address ?? "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" "),
            image: data?.image_url ?? "",
            // New users always start on free plan
            // User mới luôn bắt đầu với plan free
            plan: "free",
          },
        });
        break;
      }

      case TYPE.USER.DELETE: {
        await prisma.user.delete({
          where: { id: data.id },
        });
        break;
      }

      case TYPE.USER.CREATE: {
        await prisma.user.upsert({
          where: { id: data.id },
          create: {
            id: data.id,
            email: data?.email_addresses?.[0]?.email_address ?? "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" "),
            image: data?.image_url ?? "",
            plan: "free",
          },
          // If user already exists, just update basic info
          // Nếu user đã tồn tại, chỉ update thông tin cơ bản
          update: {
            email: data?.email_addresses?.[0]?.email_address ?? "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" "),
            image: data?.image_url ?? "",
          },
        });
        break;
      }

      case TYPE.PAYMENT.UPDATE: {
        const isPaid =
          (data.charge_type === "recurring" ||
            data.charge_type === "checkout") &&
          data.status === "paid";

        const planSlug = data?.subscription_items?.[0]?.plan?.slug;
        const clerkUserId = data?.payer?.user_id;
        const creditsToAdd = PLAN_CREDITS[planSlug];

        // Only process if payment is confirmed, plan is known, and user exists
        // Chỉ xử lý nếu thanh toán thành công, plan hợp lệ, và user tồn tại
        if (isPaid && planSlug && clerkUserId && creditsToAdd) {
          await prisma.user.update({
            where: { id: clerkUserId },
            data: {
              // Add credits on top of existing balance (not replace)
              // Cộng thêm credit vào số hiện có, không thay thế
              credits: { increment: creditsToAdd },
              // Sync plan name from Clerk to DB
              // Đồng bộ tên plan từ Clerk vào DB
              plan: planSlug,
            },
          });
        } else if (isPaid) {
          // Payment succeeded but plan/user data is missing — log for investigation
          // Thanh toán thành công nhưng thiếu thông tin plan/user — cần điều tra
          console.error("Payment succeeded but missing plan or user data:", {
            planSlug,
            clerkUserId,
            creditsToAdd,
          });
          return res.status(400).json({ message: "Invalid plan or user" });
        }
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ message: `Webhook processed: ${type}` });
  } catch (err: any) {
    console.error("Error handling Clerk webhook:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};
