import { Request, Response, Router } from "express";
import { handleClerkWebhook } from "../controllers/clerkController.js";

// Webhook router
export const webHookRouter = Router();

// Clerk webhook endpoint
webHookRouter.post("/webhooks", (req: Request, res: Response) => {
  return handleClerkWebhook(req, res);
});

export default webHookRouter;
