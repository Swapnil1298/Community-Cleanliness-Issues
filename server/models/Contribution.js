import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    issueId: { type: String, default: '' },
    issueTitle: { type: String, required: true },
    amount: { type: mongoose.Schema.Types.Mixed, required: true },
    contributorName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    additionalInfo: { type: String, default: '' },
    purpose: {
      type: String,
      default: 'For resolving this specific issue only',
    },
    fundStatus: {
      type: String,
      enum: ['payment_pending', 'paid', 'allocated', 'spent', 'refund_requested', 'refunded'],
      default: 'payment_pending',
    },
    refundPreference: {
      type: String,
      enum: ['refund', 'reallocate', 'contact_me'],
      default: 'contact_me',
    },
    paymentStatus: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
    paymentProvider: { type: String, default: 'razorpay' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpayPaymentMethod: { type: String, default: '' },
    razorpayPaymentStatus: { type: String, default: '' },
    razorpayPaymentCaptured: { type: Boolean, default: false },
    razorpayUpiVpa: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Contribution', contributionSchema);
