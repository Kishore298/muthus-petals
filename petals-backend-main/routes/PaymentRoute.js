import express from 'express';
import { createPaymentOrder, verifyPayment, getRazorpayKey, paymentWebhook } from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/create-payment-order', createPaymentOrder);
router.post('/verify-payment', verifyPayment);
router.get('/get-key', getRazorpayKey);
router.post('/webhook', paymentWebhook);

export default router;
