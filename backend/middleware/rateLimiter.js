import rateLimit from 'express-rate-limit';

// General write endpoints rate limiter: 15 requests per minute per IP
// (Bypassed during tests to prevent pipeline throttling)
export const writeLimiter = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 60 * 1000, // 1 minute window
      max: 15,
      message: { error: 'Too many resource creation requests. Please try again after 1 minute.' },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

// Sensitive auth endpoints rate limiter (Logins & Signups): 5 requests per 15 minutes per IP
export const authLimiter = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minute window
      max: 5,
      message: { error: 'Too many signup or login attempts from this IP. Please try again after 15 minutes.' },
      standardHeaders: true,
      legacyHeaders: false,
    });
