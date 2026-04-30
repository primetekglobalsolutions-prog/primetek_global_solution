import { RateLimiterMemory } from 'rate-limiter-flexible';

// Max 5 failed attempts per IP per 15 minutes
export const loginRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60, // Block for 15 minutes if exceeded
});

// CAPTCHA trigger flag at 3 attempts
export const CAPTCHA_THRESHOLD = 3;
