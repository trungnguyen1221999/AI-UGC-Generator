import projectRoutes from './routes/projectRoutes.js';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import webhookRouter from './routes/webhookRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup | Cho phép frontend gọi API
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Webhook — must use raw body for Clerk signature verification
// Webhook cần raw body để Clerk verify chữ ký — không dùng express.json()
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter);

// All other routes use JSON body parser
// Các route khác dùng JSON parser bình thường
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript backend!');
});

app.use('/api/users', userRouter);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});