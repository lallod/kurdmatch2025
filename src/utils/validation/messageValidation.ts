import { z } from 'zod';

// Message validation schema
export const messageSchema = z.object({
  text: z.string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long (max 5000 characters)')
    .trim()
    .refine(
      (text) => text.length > 0,
      'Message cannot contain only whitespace'
    ),
  recipientId: z.string().uuid('Invalid recipient ID'),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .trim()
    .optional(),
  bio: z.string()
    .max(1000, 'Bio too long (max 1000 characters)')
    .trim()
    .optional(),
  location: z.string()
    .max(200, 'Location too long')
    .trim()
    .optional(),
  age: z.number()
    .int()
    .min(18, 'Must be at least 18')
    .max(120, 'Invalid age')
    .optional(),
  occupation: z.string()
    .max(100, 'Occupation too long')
    .trim()
    .optional(),
});

// Report validation schema
export const reportSchema = z.object({
  reason: z.string()
    .min(1, 'Reason is required')
    .max(50, 'Reason too long'),
  details: z.string()
    .max(1000, 'Details too long (max 1000 characters)')
    .trim()
    .optional(),
  reportedUserId: z.string().uuid('Invalid user ID'),
  contentId: z.string().uuid('Invalid content ID').optional(),
  contentType: z.enum(['message', 'profile', 'post', 'comment']).optional(),
});

// Comment validation schema
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment too long (max 500 characters)')
    .trim(),
  postId: z.string().uuid('Invalid post ID'),
  parentCommentId: z.string().uuid().optional(),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
