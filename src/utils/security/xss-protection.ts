/**
 * XSS Protection Utilities
 * 
 * This module provides comprehensive XSS (Cross-Site Scripting) protection
 * for user-generated content throughout the application.
 */

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for different sanitization levels
 */
const SANITIZATION_CONFIGS = {
  // Strict: Removes all HTML, only keeps plain text
  strict: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  
  // Basic: Allows simple formatting tags
  basic: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  },
  
  // Rich: Allows more HTML for rich text (posts, bios)
  rich: {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:https?:\/\/)/,
  },
};

/**
 * Sanitizes user input to prevent XSS attacks
 * 
 * @param dirty - The potentially unsafe string to sanitize
 * @param level - Sanitization level: 'strict', 'basic', or 'rich'
 * @returns Sanitized safe string
 * 
 * @example
 * // Strict (plain text only)
 * sanitizeInput('<script>alert("xss")</script>Hello', 'strict')
 * // Returns: "Hello"
 * 
 * // Basic (simple formatting)
 * sanitizeInput('<b>Bold</b> and <script>alert("xss")</script>', 'basic')
 * // Returns: "<b>Bold</b> and "
 * 
 * // Rich (for posts/bios)
 * sanitizeInput('<p>Hello <a href="https://example.com">link</a></p>', 'rich')
 * // Returns: "<p>Hello <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a></p>"
 */
export function sanitizeInput(
  dirty: string | null | undefined,
  level: 'strict' | 'basic' | 'rich' = 'strict'
): string {
  if (!dirty) return '';
  
  const config = SANITIZATION_CONFIGS[level];
  
  // Add security attributes to links
  if (level === 'rich') {
    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
  
  const clean = DOMPurify.sanitize(dirty, config);
  
  // Remove the hook after use
  if (level === 'rich') {
    DOMPurify.removeAllHooks();
  }
  
  return clean;
}

/**
 * Sanitizes HTML for display in React components
 * Use with dangerouslySetInnerHTML when you must render HTML
 * 
 * @param html - The HTML string to sanitize
 * @returns Object suitable for dangerouslySetInnerHTML
 * 
 * @example
 * <div dangerouslySetInnerHTML={sanitizeHTML(userBio)} />
 */
export function sanitizeHTML(html: string | null | undefined): { __html: string } {
  return {
    __html: sanitizeInput(html, 'rich'),
  };
}

/**
 * Escapes special characters for safe display
 * Useful for displaying user input in text contexts
 * 
 * @param text - Text to escape
 * @returns Escaped text safe for display
 * 
 * @example
 * escapeText('<script>alert("xss")</script>')
 * // Returns: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
export function escapeText(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and sanitizes URLs to prevent javascript: and data: URIs
 * 
 * @param url - URL to validate
 * @returns Sanitized URL or empty string if invalid
 * 
 * @example
 * sanitizeURL('javascript:alert("xss")') // Returns: ""
 * sanitizeURL('https://example.com') // Returns: "https://example.com"
 */
export function sanitizeURL(url: string | null | undefined): string {
  if (!url) return '';
  
  // Remove whitespace
  const trimmed = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(trimmed)) {
    console.warn('Blocked dangerous URL protocol:', trimmed);
    return '';
  }
  
  // Only allow http, https, mailto
  const allowedProtocols = /^(https?|mailto):/i;
  if (trimmed.includes(':') && !allowedProtocols.test(trimmed)) {
    console.warn('Blocked non-whitelisted protocol:', trimmed);
    return '';
  }
  
  return DOMPurify.sanitize(trimmed, { ALLOWED_URI_REGEXP: /^(?:https?|mailto):/ });
}

/**
 * Sanitizes filename to prevent path traversal attacks
 * 
 * @param filename - Filename to sanitize
 * @returns Safe filename
 * 
 * @example
 * sanitizeFilename('../../etc/passwd') // Returns: "passwd"
 * sanitizeFilename('normal-file.jpg') // Returns: "normal-file.jpg"
 */
export function sanitizeFilename(filename: string | null | undefined): string {
  if (!filename) return '';
  
  // Remove path separators and parent directory references
  return filename
    .replace(/^.*[\\\/]/, '') // Remove path
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .slice(0, 255); // Limit length
}
