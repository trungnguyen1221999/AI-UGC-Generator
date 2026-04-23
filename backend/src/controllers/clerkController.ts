import { Request, Response } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { prisma } from '../config/prisma.js';

const TYPE = {
    USER: {
        CREATE: 'user.created',
        DELETE: 'user.deleted',
        UPDATE: 'user.updated',
    },
    PAYMENT: {
        UPDATE: 'paymentAttempt.updated',
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
            case TYPE.USER.CREATE: {
                await prisma.user.create({
                    data: {
                        id: data.id,
                        email: data?.email_address?.[0]?.email_address ?? '',
                        name: [data.first_name, data.last_name].filter(Boolean).join(' '),
                        image: data?.image_url ?? '',
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
            case TYPE.USER.UPDATE: {
                await prisma.user.update({
                    where: { id: data.id },
                    data: {
                        email: data?.email_address?.[0]?.email_address ?? '',
                        name: [data.first_name, data.last_name].filter(Boolean).join(' '),
                        image: data?.image_url ?? '',
                    },
                });
                break;
            }
            case TYPE.PAYMENT.UPDATE: {
                const isPaid = (data.charge_type === 'recurring' || data.charge_type === 'checkout') && data.status === 'paid';
                const planId = data?.subscription_items?.[0]?.plan?.slug;
                const clerkUserId = data?.payer?.user_id;
                if (isPaid && planId && clerkUserId && PLAN_CREDITS[planId]) {
                    await prisma.user.update({
                        where: { id: clerkUserId },
                        data: {
                            credit: { increment: PLAN_CREDITS[planId] },
                        },
                    });
                } else if (isPaid) {
                    return res.status(400).json({ message: 'Invalid Plan or User' });
                }
                break;
            }
            default:
                break;
        }
        res.status(200).json({ message: 'Webhook processed ' + type });
    } catch (err) {
        console.error('Error handling Clerk webhook:', err);
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
};