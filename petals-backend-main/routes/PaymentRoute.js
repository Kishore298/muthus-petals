import express from 'express';
import { createPaymentOrder, verifyPayment, getRazorpayKey } from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/create-payment-order', createPaymentOrder);
router.post('/verify-payment', verifyPayment);
router.get('/get-key', getRazorpayKey);

export default router;
