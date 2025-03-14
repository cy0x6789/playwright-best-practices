import { z } from 'zod';

// Account schema for validation
export const accountSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean()
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Registration schema
export const registrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Type definitions derived from schemas
export type Account = z.infer<typeof accountSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegistrationData = z.infer<typeof registrationSchema>;

// Response interfaces
export interface LoginResponse {
  token: string;
  account: Account;
}

export interface RegistrationResponse {
  id: string;
  message: string;
}
