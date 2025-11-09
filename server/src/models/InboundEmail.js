import mongoose from 'mongoose';

const inboundEmailSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    email: { type: String, required: true },
    name: { type: String },
  },
  to: [
    {
      email: { type: String, required: true },
      name: { type: String },
    }
  ],
  cc: [
    {
      email: { type: String },
      name: { type: String },
    }
  ],
  bcc: [
    {
      email: { type: String },
      name: { type: String },
    }
  ],
  subject: {
    type: String,
    required: true,
  },
  text: String,
  html: String,
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  starred: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  labels: [String],
  attachments: [
    {
      filename: String,
      contentType: String,
      size: Number,
      url: String,
    }
  ],
  replyTo: {
    email: String,
    name: String,
  },
  inReplyTo: String,
  references: [String],
  forwardedToGmail: {
    type: Boolean,
    default: false,
  },
  forwardedAt: Date,
}, {
  timestamps: true,
});

// Index for faster queries
inboundEmailSchema.index({ receivedAt: -1 });
inboundEmailSchema.index({ 'from.email': 1 });
inboundEmailSchema.index({ read: 1 });
inboundEmailSchema.index({ archived: 1 });

const InboundEmail = mongoose.model('InboundEmail', inboundEmailSchema);

export default InboundEmail;
