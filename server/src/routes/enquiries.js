import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { sendEnquiryNotification } from '../utils/email.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Enquiry.find().sort({ createdAt: -1 }).lean();
  res.json(items.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })));
});

router.post('/', async (req, res) => {
  const payload = req.body || {};
  const doc = await Enquiry.create(payload);
  
  // Send email notification to admin (async, don't wait)
  const enquiry = { id: doc._id.toString(), ...doc.toObject() };
  sendEnquiryNotification(enquiry).catch(err => 
    console.error('Email notification failed:', err)
  );
  
  res.status(201).json({ id: doc._id.toString(), ...doc.toObject(), _id: undefined });
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};
  const doc = await Enquiry.findByIdAndUpdate(id, payload, { new: true }).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ id: doc._id.toString(), ...doc });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const doc = await Enquiry.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;
