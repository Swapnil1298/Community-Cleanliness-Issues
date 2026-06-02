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
      enum: ['recorded', 'allocated', 'spent', 'refund_requested', 'refunded'],
      default: 'recorded',
    },
    refundPreference: {
      type: String,
      enum: ['refund', 'reallocate', 'contact_me'],
      default: 'contact_me',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contribution', contributionSchema);
