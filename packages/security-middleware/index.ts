import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

// Security rate limiting configuration
export const securityRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware bundle
export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
  securityRateLimit,
];

// Audit logging middleware
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const userId = (req as any).userId || 'anonymous';
  const action = `${req.method} ${req.path}`;
  const ip = req.ip || req.connection.remoteAddress;
  
  const auditLog = {
    timestamp,
    userId,
    action,
    ip,
    userAgent: req.get('User-Agent'),
    statusCode: res.statusCode
  };
  
  // Log to console (can be replaced with file logging later)
  console.log(`[AUDIT] ${JSON.stringify(auditLog)}`);
  
  next();
};
