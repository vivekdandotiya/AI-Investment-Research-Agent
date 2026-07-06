import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import analyzeRouter from './routes/analyze.js';

// env variables load kar rhe hain yahan se
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// helmet se thoda security configurations set kiya
app.use(helmet({
  contentSecurityPolicy: false, // agar SSE me issue aaye to isko false rakhna hi thik hai
}));

// react development port ko backend se connect karne ke liye CORS setup kiya
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

// body-parser parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api testing ke logs print karne ke liye morgan middleware use kiya
app.use(morgan('dev'));

// safety ke liye limit lagaya taaki koi spam ya ddos na kar sake
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes ka window
  max: 100, // maximum 100 requests per IP
  message: { error: 'Bhai, bohot saari requests bhej di tumne. 15 mins baad try karna!' }
});
app.use('/api/', limiter);

// checking ki server up hai ya nhi
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(), // server kitni der se chal rha hai (uptime)
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// multi-agent router endpoints yahan register kiya
app.use('/api/analyze', analyzeRouter);

// global error catch karne ke liye middleware
app.use((err, req, res, next) => {
  console.error('Kuch gadbad ho gayi backend me:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Server Error ho gaya bhai!',
    timestamp: new Date().toISOString()
  });
});

// port listen
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  AI Investment Agent Backend port ${PORT} par chalu hai  `);
  console.log(`===================================================`);
});

export default app;
