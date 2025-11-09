import express from 'express';
import Subscriber from '../models/Subscriber.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
  res.json(items.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })));
});

router.post('/', async (req, res) => {
  const { email, source } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const exists = await Subscriber.findOne({ email });
  if (exists) return res.status(200).json({ id: exists._id.toString(), ...exists.toObject(), _id: undefined });
  const doc = await Subscriber.create({ email, source });
  res.status(201).json({ id: doc._id.toString(), ...doc.toObject(), _id: undefined });
});

export default router;
