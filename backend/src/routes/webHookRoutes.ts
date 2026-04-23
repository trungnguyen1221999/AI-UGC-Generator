import { Router } from 'express';
import { handleClerkWebhook } from '../controllers/clerkController';

const router = Router();

// Webhook endpoint
router.post('/webhooks', (req, res, next) => {
  // express.raw middleware must be applied at the app level, so just call handler
  handleClerkWebhook(req, res, next);
});

export default router;
