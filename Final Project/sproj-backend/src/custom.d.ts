// src/custom.d.ts (or another name you prefer)
import { Request } from 'express';
import { AuthObject } from '@clerk/backend';

declare global {
  namespace Express {
    interface Request {
      auth: AuthObject;
      userId?: string;
    }
  }
}

// This is needed to make this file a module
export {};
