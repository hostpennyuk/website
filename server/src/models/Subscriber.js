import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    source: String,
  },
  { timestamps: false }
);

export default mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
