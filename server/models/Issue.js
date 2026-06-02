import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    amount: { type: Number, required: true },
    status: { type: String, default: 'ongoing' },
    date: { type: String, required: true },
    email: { type: String, required: true },
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
    receiptNote: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['not_submitted', 'pending_review', 'admin_verified'],
      default: 'not_submitted',
    },
    verifiedBy: { type: String, default: '' },
    resolvedAt: { type: String, default: '' },
    refundPolicy: {
      type: String,
      default:
        'If this issue is not resolved, contributors may request a refund or choose reallocation to another verified community issue.',
    },
    progressUpdates: [
      {
        note: { type: String, required: true },
        date: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Issue', issueSchema);
