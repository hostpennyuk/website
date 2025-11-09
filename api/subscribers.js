import mongoose from 'mongoose';

// MongoDB connection
let cachedDb = null;
async function connectDb() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(process.env.MONGODB_URI, { dbName: 'hostpenny' });
  cachedDb = db;
  return db;
}

// Subscriber Model
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  source: String,
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDb();

  try {
    if (req.method === 'GET') {
      const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
      return res.status(200).json(subscribers);
    }
    
    if (req.method === 'POST') {
      const { email, source } = req.body;
      const existing = await Subscriber.findOne({ email });
      
      if (existing) {
        return res.status(200).json(existing);
      }
      
      const subscriber = new Subscriber({ email, source });
      await subscriber.save();
      return res.status(201).json(subscriber);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
