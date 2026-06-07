import mongoose from 'mongoose';

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    source: { type: String, default: 'home_newsletter' },
  },
  { timestamps: true }
);

export default mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema);
