import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import webhookRouter from './routes/webhook.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
// Webhook endpoint (express.raw must be applied at app level)
app.use('/api', express.raw({ type: 'application/json' }));
app.use('/api', webhookRouter);


app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
