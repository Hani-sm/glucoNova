import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'gluconova-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
    isApproved: boolean;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole; isApproved: boolean };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function roleMiddleware(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}

export function approvalMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin' && !req.user.isApproved) {
    return res.status(403).json({ message: 'Account pending approval' });
  }

  next();
}

export const authWithApproval = [authMiddleware, approvalMiddleware];

export function generateToken(userId: string, role: UserRole, isApproved: boolean): string {
  return jwt.sign(
    { userId, role, isApproved },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
