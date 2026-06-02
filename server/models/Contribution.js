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
  },
  { timestamps: true }
);

export default mongoose.model('Contribution', contributionSchema);
