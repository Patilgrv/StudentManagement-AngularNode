import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';
import { AppError } from './error.middleware';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    next();
    return;
  }

  if (store[ip].count >= maxRequests) {
    next(new AppError('Too many requests, please try again later', 429));
    return;
  }

  store[ip].count++;
  next();
};

