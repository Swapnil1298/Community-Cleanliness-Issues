import { Router } from 'express';
import NewsletterSubscription from '../models/NewsletterSubscription.js';

const router = Router();

router.post('/subscribe', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSubscription = await NewsletterSubscription.findOne({ email });
    if (existingSubscription) {
      return res.json({
        message: 'You are already subscribed to community updates.',
        subscription: {
          email: existingSubscription.email,
          subscribedAt: existingSubscription.createdAt,
        },
      });
    }

    const subscription = await NewsletterSubscription.create({
      email,
      source: req.body.source || 'home_newsletter',
    });

    res.status(201).json({
      message: 'Subscription successful. You will receive community updates soon.',
      subscription: {
        email: subscription.email,
        subscribedAt: subscription.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
