import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_APIKEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    const msg = error.error ? error.error.description : 'Internal Server Error';
    res.status(500).json({ success: false, message: msg });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay signature',
      });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_API_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body) // req.body is a raw Buffer because of express.raw
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      console.warn('Invalid Razorpay webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = JSON.parse(req.body.toString());
    console.log('Razorpay webhook:', event.event);

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        console.log('Payment captured:', {
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount,
        });
        // TODO: Update Order DB paymentStatus = 'PAID'
        break;
      }
      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        console.log('Payment failed:', {
          paymentId: payment.id,
          orderId: payment.order_id,
          reason: payment.error_description,
          code: payment.error_code,
        });
        // TODO: Update Order DB paymentStatus = 'FAILED'
        break;
      }
      case 'order.paid': {
        const order = event.payload.order.entity;
        console.log('Order paid:', {
          orderId: order.id,
          amount: order.amount,
          amountPaid: order.amount_paid,
        });
        break;
      }
      case 'payment.authorized': {
        const payment = event.payload.payment.entity;
        console.log('Payment authorized:', payment.id);
        break;
      }
      case 'payment.refunded': {
        const payment = event.payload.payment.entity;
        console.log('Payment refunded:', payment.id);
        break;
      }
      default:
        console.log('Unhandled Razorpay event:', event.event);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};

export const getRazorpayKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_APIKEY });
};

