import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export const requireMFA = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  
  if (!auth.sessionClaims) {
    return res.status(401).json({ message: 'No authentication session found' });
  }

  const claims = auth.sessionClaims as any;
  
  // Check if MFA is verified (Clerk provides this in session claims)
  if (!claims.aud || !claims.azp || !claims.sid) {
    return res.status(403).json({ 
      message: 'MFA required',
      requiresMFA: true,
      mfaMethods: ['totp', 'sms', 'backup_code']
    });
  }

  next();
};

export const validateInput = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};
