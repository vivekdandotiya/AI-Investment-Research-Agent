import express from 'express';
import { analyzeCompany, streamAnalyzeCompany } from '../services/orchestrator.js';

const router = express.Router();

// Synchronous POST analysis endpoint
router.post('/', async (req, res, next) => {
  const { companyName, useMockData } = req.body;
  
  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return res.status(400).json({ error: 'Company name is required.' });
  }

  try {
    const result = await analyzeCompany(companyName.trim(), !!useMockData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Streaming GET analysis endpoint via Server-Sent Events (SSE)
router.get('/stream', async (req, res, next) => {
  const { companyName, useMockData } = req.query;

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    res.status(400).json({ error: 'Company name query parameter is required.' });
    return;
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Prevent buffering in proxies (Nginx, Vercel)

  // Send initial ping/connection event
  res.write(`data: ${JSON.stringify({ status: 'connected', message: `Initializing Investment Research Agent for ${companyName.trim()}...` })}\n\n`);

  // Simple keep-alive interval to prevent client disconnection on long requests
  const keepAliveInterval = setInterval(() => {
    res.write(': keep-alive\n\n');
  }, 15000);

  try {
    await streamAnalyzeCompany(companyName.trim(), useMockData === 'true', (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
  } catch (error) {
    console.error('Streaming Analysis Error:', error);
    res.write(`data: ${JSON.stringify({ status: 'error', message: `Analysis failed: ${error.message}` })}\n\n`);
  } finally {
    clearInterval(keepAliveInterval);
    res.end();
  }
});

export default router;
