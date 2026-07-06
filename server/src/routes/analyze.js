import express from 'express';
import { analyzeCompany, streamAnalyzeCompany } from '../services/orchestrator.js';

const router = express.Router();

// normal POST call - agar streaming nahi chahiye to
router.post('/', async (req, res, next) => {
  const { companyName, useMockData } = req.body;
  
  // check kar rha hoon ki companyName khali to nahi hai
  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return res.status(400).json({ error: 'Bhai, company ka naam dena zaroori hai!' });
  }

  try {
    // backend analysis execute kar rha hai
    const result = await analyzeCompany(companyName.trim(), !!useMockData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// SSE (Server-Sent Events) endpoint - taaki agents ke logs client par stream ho sakein
router.get('/stream', async (req, res, next) => {
  const { companyName, useMockData } = req.query;

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    res.status(400).json({ error: 'Stream ke liye companyName bhejna padega query me!' });
    return;
  }

  // SSE ke zaroori headers set kar rahe hain yahan
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // proxy buffering band karne ke liye (important for Vercel/Nginx)

  // connection establish hote hi pehla message send kiya
  res.write(`data: ${JSON.stringify({ status: 'connected', message: `${companyName.trim()} ke liye agents ready kar rahe hain...` })}\n\n`);

  // tab tak ping bhejte rahenge taaki connection timeout na ho jaye long execution me
  const keepAliveInterval = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 15000);

  try {
    // orchestrator stream chala raha hai
    await streamAnalyzeCompany(companyName.trim(), useMockData === 'true', (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
  } catch (error) {
    console.error('Streaming API me issue aaya:', error);
    res.write(`data: ${JSON.stringify({ status: 'error', message: `Analysis beech me hi ruk gayi: ${error.message}` })}\n\n`);
  } finally {
    // kaam hone ke baad interval band karo aur stream close karo
    clearInterval(keepAliveInterval);
    res.end();
  }
});

export default router;
