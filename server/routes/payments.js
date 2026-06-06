import { Router } from 'express';
import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import process from 'node:process';
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

const createRazorpayAuthHeader = (keyId, keySecret) =>
  `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

const callRazorpayApi = async (path, options = {}) => {
  const { keyId, keySecret } = getRazorpayCredentials();
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: createRazorpayAuthHeader(keyId, keySecret),
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.description || 'Razorpay API request failed');
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const validatePaidPayment = (payment, expected) => {
  if (payment.order_id !== expected.orderId) {
    throw new Error('Payment order does not match the verified order');
  }

  if (payment.amount !== expected.amount) {
    throw new Error('Payment amount does not match the contribution amount');
  }

  if (payment.currency !== expected.currency) {
    throw new Error('Payment currency does not match INR');
  }

  if (payment.status !== 'captured' || payment.captured !== true) {
    throw new Error('Payment was not captured successfully');
  }
};

router.post('/orders', async (req, res) => {
  try {
    const { keyId } = getRazorpayCredentials();
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'A valid contribution amount is required' });
    }

    const order = await callRazorpayApi('/orders', {
      method: 'POST',
      body: {
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `issue_${req.body.issueId || 'general'}_${Date.now()}`.slice(0, 40),
        notes: {
          issueId: req.body.issueId || '',
          issueTitle: req.body.issueTitle || '',
        },
      },
    });

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

    const contributionAmount = Number(contribution.amount);
    if (!contributionAmount || contributionAmount <= 0) {
      return res.status(400).json({ message: 'A valid contribution amount is required' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const existingContribution = await Contribution.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingContribution) {
      return res.json(toContributionResponse(existingContribution));
    }

    const expectedPayment = {
      orderId: razorpay_order_id,
      amount: Math.round(contributionAmount * 100),
      currency: 'INR',
    };
    let payment = await callRazorpayApi(`/payments/${razorpay_payment_id}`);

    if (payment.order_id !== expectedPayment.orderId) {
      throw new Error('Payment order does not match the verified order');
    }

    if (payment.amount !== expectedPayment.amount) {
      throw new Error('Payment amount does not match the contribution amount');
    }

    if (payment.currency !== expectedPayment.currency) {
      throw new Error('Payment currency does not match INR');
    }

    if (payment.status === 'authorized' && payment.captured !== true) {
      payment = await callRazorpayApi(`/payments/${razorpay_payment_id}/capture`, {
        method: 'POST',
        body: {
          amount: expectedPayment.amount,
          currency: expectedPayment.currency,
        },
      });
    }

    validatePaidPayment(payment, expectedPayment);

    const savedContribution = await Contribution.create({
      ...contribution,
      amount: contributionAmount,
      fundStatus: 'paid',
      paymentStatus: 'paid',
      paymentProvider: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpayPaymentMethod: payment.method || '',
      razorpayPaymentStatus: payment.status,
      razorpayPaymentCaptured: Boolean(payment.captured),
      razorpayUpiVpa: payment.upi?.vpa || '',
    });

    res.status(201).json(toContributionResponse(savedContribution));
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

export default router;
