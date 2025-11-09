import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    company: String,
    projectType: String,
    idea: String,
    budget: String,
    timeline: String,

    status: { type: String, default: 'New' },
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
    assignee: { type: String, default: '' },
    dueDate: { type: String, default: '' },
    links: { type: [String], default: [] },
    spam: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
