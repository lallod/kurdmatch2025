/**
 * Production-safe logger utility.
 * Silent in production builds to prevent leaking internal logic.
 */

const isProd = import.meta.env.PROD;

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProd) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (!isProd) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  info: (...args: unknown[]) => {
    if (!isProd) console.info(...args);
  },
  debug: (...args: unknown[]) => {
    if (!isProd) console.debug(...args);
  },
};
