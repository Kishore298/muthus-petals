import express from 'express';
import dns from "node:dns";

// Force Node.js to use public DNS servers to resolve MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Products from './routes/productroutes.js';
import userrouter from './routes/AuthRouter.js';
import testimonialroute from './routes/TestimonialRoute.js';
import paymentRoute from './routes/PaymentRoute.js';
import { paymentWebhook } from './controllers/PaymentController.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import orderRoute from './routes/orderRoute.js';
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();

// Razorpay webhook must receive raw body for signature verification
app.post('/api/v1/payment/payment-webhook', express.raw({ type: 'application/json' }), paymentWebhook);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Product API
app.use('/api/v1', Products);

// User API
app.use('/api/v1', userrouter);

// Order API
app.use('/api/v1', orderRoute);

//testimonial 
app.use('/api/v1', testimonialroute)

// Payment API
app.use('/api/v1/payment', paymentRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

async function main() {
  await mongoose.connect(process.env.MONGODB, {

  });
  console.log("MongoDB connected");
}

main().catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
