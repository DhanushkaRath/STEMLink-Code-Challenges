import { AuthObject } from '@clerk/backend';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      auth: AuthObject;
      userId?: string;
    }
  }
} 