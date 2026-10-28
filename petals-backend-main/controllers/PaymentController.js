import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Ordermodel from "../model/Order.js";
import productmodel from "../model/Product.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_APIKEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, notes } = req.body;
    
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay works in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: notes || {},
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
      .update(req.rawBody || req.body) // req.rawBody is captured via express.json verify
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

    const event = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString()) : req.body;
    console.log('Razorpay webhook:', event.event);

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        console.log('Payment captured:', {
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount,
        });

        // 1. Check if order exists in DB
        const existingOrder = await Ordermodel.findOneAndUpdate(
          { razorpay_order_id: payment.order_id },
          { 
            paymentStatus: 'PAID',
            razorpay_payment_id: payment.id
          },
          { new: true }
        );

        // 2. If order document does not exist (e.g. mobile UPI tab closed before options.handler ran)
        if (!existingOrder) {
          console.log(`Order not found for razorpay_order_id ${payment.order_id}. Auto-creating from payment data...`);
          const notes = payment.notes || {};
          const customerName = notes.name || (payment.email ? payment.email.split('@')[0] : 'Customer');
          const email = notes.email || payment.email || 'customer@example.com';
          const phone = notes.phone || (payment.contact ? payment.contact.replace('+91', '').trim() : '0000000000');
          const address = notes.address || 'Address pending confirmation (UPI Payment)';
          const city = notes.city || 'Tamil Nadu';
          const pin = notes.pin || '600000';
          const country = notes.country || 'India';
          const totalprice = payment.amount ? payment.amount / 100 : 0;

          // Parse products from notes
          let orderItems = [];
          const itemCount = parseInt(notes.item_count || '0', 10);
          if (itemCount > 0) {
            for (let idx = 1; idx <= itemCount; idx++) {
              const rawItem = notes[`item_${idx}`];
              if (rawItem) {
                try {
                  const parsed = JSON.parse(rawItem);
                  orderItems.push({
                    name: parsed.name,
                    price: Number(parsed.price),
                    quantity: Number(parsed.qty || parsed.quantity || 1),
                    size: parsed.size || '',
                    color: parsed.color || '',
                    product: parsed.id
                  });
                } catch (e) {
                  console.error('Error parsing note item:', e);
                }
              }
            }
          }

          // Fallback if no items in notes
          if (orderItems.length === 0) {
            const defaultProduct = await productmodel.findOne({ name: /Lice/i });
            if (defaultProduct) {
              orderItems = [{
                name: defaultProduct.name,
                price: defaultProduct.price,
                quantity: 1,
                size: '200',
                color: 'white',
                product: defaultProduct._id
              }];
            }
          }

          const shippingCharge = notes.shipping_charge !== undefined
            ? Number(notes.shipping_charge)
            : (totalprice >= 789 ? 90 : 50);

          const newOrder = await Ordermodel.create({
            name: customerName,
            address,
            email,
            city,
            country,
            phone,
            pin,
            orderItems,
            shippingCharge,
            totalprice,
            orderStatus: 'Processing',
            razorpay_order_id: payment.order_id,
            razorpay_payment_id: payment.id,
            paymentStatus: 'PAID',
            createdAt: new Date(payment.created_at ? payment.created_at * 1000 : Date.now())
          });
          console.log(`Auto-created order ID ${newOrder._id} for captured payment ${payment.id}`);
        }
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
        await Ordermodel.findOneAndUpdate(
          { razorpay_order_id: payment.order_id },
          { paymentStatus: 'FAILED' }
        );
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

