import { Router } from 'express';
import crypto from 'crypto';
import Contribution from '../models/Contribution.js';

const router = Router();

const toContributionResponse = (doc) => {
  const obj = doc.toObject();
  return {
    id: obj._id.toString(),
    ...obj,
    _id: undefined,
    __v: undefined,
  };
};

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay payment keys are not configured on the server');
  }

  return { keyId, keySecret };
};

router.post('/orders', async (req, res) => {
  try {
    const { keyId, keySecret } = getRazorpayCredentials();
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'A valid contribution amount is required' });
    }

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `issue_${req.body.issueId || 'general'}_${Date.now()}`.slice(0, 40),
        notes: {
          issueId: req.body.issueId || '',
          issueTitle: req.body.issueTitle || '',
        },
      }),
    });

    const order = await orderResponse.json();

    if (!orderResponse.ok) {
      return res.status(orderResponse.status).json({
        message: order.error?.description || 'Failed to create Razorpay order',
      });
    }

    res.status(201).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { keySecret } = getRazorpayCredentials();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      contribution,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !contribution) {
      return res.status(400).json({ message: 'Payment verification data is incomplete' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const savedContribution = await Contribution.create({
      ...contribution,
      fundStatus: 'paid',
      paymentStatus: 'paid',
      paymentProvider: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.status(201).json(toContributionResponse(savedContribution));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
