import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DetectionSystem } from '../core/DetectionSystem.js';
import { EventSchema } from '../models/ThreatEvent.js';
import { SecurityUtils } from '../utils/Security.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const system = new DetectionSystem();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
})); 

app.use(cors()); 
app.use(express.json());

// Rate Limiting to prevent DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// API Key Middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!SecurityUtils.validateApiKey(apiKey)) {
    console.warn(`[Security] Unauthorized access attempt from IP: ${SecurityUtils.maskIP(req.ip || 'unknown')}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }
  next();
};

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', system: 'Adaptive Threat Detection' });
});

// Event Ingestion Endpoint (Protected)
app.post('/api/events', authenticate, async (req, res) => {
  try {
    // 1. Strict Validation with Zod
    const validation = EventSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.format() 
      });
    }

    const eventData = validation.data;
    const result = await system.processEvent(eventData);
    
    res.status(200).json({
      success: true,
      risk: result,
    });
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`[Security] System active on port ${port}`);
  console.log(`[Ready] Adaptive Threat Detection System is learning...`);
});
