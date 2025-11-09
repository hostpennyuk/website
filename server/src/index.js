import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDb } from './utils/db.js';
import enquiriesRouter from './routes/enquiries.js';
import subscribersRouter from './routes/subscribers.js';
import inboundEmailsRouter from './routes/inbound-emails.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for email content
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/subscribers', subscribersRouter);
app.use('/api/inbound-emails', inboundEmailsRouter);

const PORT = process.env.PORT || 4000;

connectDb(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
