import { z } from "zod";

export const userRoles = ['patient', 'doctor', 'admin'] as const;
export type UserRole = typeof userRoles[number];

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthData {
  _id: string;
  userId: string;
  glucose: number;
  insulin: number;
  carbs: number;
  activityLevel?: string;
  timestamp: Date;
  notes?: string;
}

export interface Meal {
  _id: string;
  userId: string;
  name: string;
  carbs: number;
  protein?: number;
  fat?: number;
  calories?: number;
  timestamp: Date;
  voiceRecorded: boolean;
}

export interface MedicalReport {
  _id: string;
  userId: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}

export interface Prediction {
  _id: string;
  userId: string;
  predictedInsulin: number;
  confidence: number;
  factors: {
    glucose: number;
    carbs: number;
    activityLevel: string;
  };
  timestamp: Date;
}

export const insertUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(userRoles),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const healthDataSchema = z.object({
  glucose: z.number().min(0).max(1000),
  insulin: z.number().min(0).max(200),
  carbs: z.number().min(0).max(500),
  activityLevel: z.string().optional(),
  notes: z.string().optional(),
});

export const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  carbs: z.number().min(0),
  protein: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  voiceRecorded: z.boolean().default(false),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertHealthData = z.infer<typeof healthDataSchema>;
export type InsertMeal = z.infer<typeof mealSchema>;
