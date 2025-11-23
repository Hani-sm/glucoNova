import {  type User,
  type InsertUser,
  type HealthData,
  type InsertHealthData,
  type Meal,
  type InsertMeal,
  type MedicalReport,
  type InsertMedicalReport,
  type Prediction,
  type InsertPrediction,
  type UserProfile,
  type InsertUserProfile,
  type Medication,
  type InsertMedication,
  users,
  healthData,
  meals,
  medicalReports,
  predictions,
  userProfiles,
  medications,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  updateUserApproval(id: string, isApproved: boolean): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  
  // Health data operations
  createHealthData(userId: string, data: InsertHealthData): Promise<HealthData>;
  getHealthDataByUser(userId: string, limit?: number): Promise<HealthData[]>;
  getLatestHealthData(userId: string): Promise<HealthData | null>;
  
  // Meal operations
  createMeal(userId: string, meal: InsertMeal): Promise<Meal>;
  getMealsByUser(userId: string, limit?: number): Promise<Meal[]>;
  
  // Medical report operations
  getMedicalReportsByPatient(patientId: string): Promise<MedicalReport[]>;
  getMedicalReportById(reportId: string): Promise<MedicalReport | null>;
  createMedicalReport(patientId: string, uploaderId: string, report: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    description?: string;
  }): Promise<MedicalReport>;
  
  // Prediction operations
  createPrediction(userId: string, prediction: InsertPrediction): Promise<Prediction>;
  getPredictionsByUser(userId: string, limit?: number): Promise<Prediction[]>;
  getLatestPrediction(userId: string): Promise<Prediction | null>;
  
  // User profile operations
  createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | null>;
  
  // Medication operations
  createMedication(userId: string, medication: InsertMedication): Promise<Medication>;
  getMedicationsByUser(userId: string): Promise<Medication[]>;
  deleteMedication(userId: string, medicationId: string): Promise<boolean>;
}

// Helper function to coerce nullable values
function toNumber(val: number | null): number | undefined {
  return val === null ? undefined : val;
}

export class DrizzleStorage implements IStorage {
  // ==================== USER OPERATIONS ====================
  
  async getUser(id: string): Promise<User | null> {
    const userId = parseInt(id);
    if (isNaN(userId)) return null;
    
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (result.length === 0) return null;
    
    const user = result[0];
    return {
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (result.length === 0) return null;
    
    const user = result[0];
    return {
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const isApproved = true;
    
    const result = await db.insert(users).values({
      ...insertUser,
      isApproved,
    }).returning();
    
    const user = result[0];
    return {
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserApproval(id: string, isApproved: boolean): Promise<User | null> {
    const userId = parseInt(id);
    if (isNaN(userId)) return null;
    
    const result = await db.update(users)
      .set({ isApproved, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) return null;
    
    const user = result[0];
    return {
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers(): Promise<User[]> {
    const result = await db.select().from(users);
    
    return result.map(user => ({
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  // ==================== HEALTH DATA OPERATIONS ====================
  
  async createHealthData(userId: string, data: InsertHealthData): Promise<HealthData> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new Error('Invalid user ID');
    
    const result = await db.insert(healthData).values({
      userId: userIdNum,
      glucose: Math.round(data.glucose),
      insulin: Math.round(data.insulin),
      carbs: Math.round(data.carbs),
      activityLevel: data.activityLevel,
      notes: data.notes,
    }).returning();
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      glucose: record.glucose,
      insulin: record.insulin,
      carbs: record.carbs,
      activityLevel: record.activityLevel || undefined,
      notes: record.notes || undefined,
      timestamp: record.timestamp,
    };
  }

  async getHealthDataByUser(userId: string, limit: number = 50): Promise<HealthData[]> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return [];
    
    const result = await db.select()
      .from(healthData)
      .where(eq(healthData.userId, userIdNum))
      .orderBy(desc(healthData.timestamp))
      .limit(limit);
    
    return result.map(record => ({
      _id: record.id.toString(),
      userId: userId,
      glucose: record.glucose,
      insulin: record.insulin,
      carbs: record.carbs,
      activityLevel: record.activityLevel || undefined,
      notes: record.notes || undefined,
      timestamp: record.timestamp,
    }));
  }

  async getLatestHealthData(userId: string): Promise<HealthData | null> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return null;
    
    const result = await db.select()
      .from(healthData)
      .where(eq(healthData.userId, userIdNum))
      .orderBy(desc(healthData.timestamp))
      .limit(1);
    
    if (result.length === 0) return null;
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      glucose: record.glucose,
      insulin: record.insulin,
      carbs: record.carbs,
      activityLevel: record.activityLevel || undefined,
      notes: record.notes || undefined,
      timestamp: record.timestamp,
    };
  }

  // ==================== MEAL OPERATIONS ====================
  
  async createMeal(userId: string, meal: InsertMeal): Promise<Meal> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new Error('Invalid user ID');
    
    const result = await db.insert(meals).values({
      userId: userIdNum,
      name: meal.name,
      carbs: Math.round(meal.carbs),
      protein: meal.protein == null ? null : Math.round(meal.protein),
      fat: meal.fat == null ? null : Math.round(meal.fat),
      calories: meal.calories ?? null,
      voiceRecorded: meal.voiceRecorded,
    }).returning();
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      name: record.name,
      carbs: record.carbs,
      protein: record.protein ?? undefined,
      fat: record.fat ?? undefined,
      calories: record.calories ?? undefined,
      voiceRecorded: record.voiceRecorded,
      timestamp: record.timestamp,
    };
  }

  async getMealsByUser(userId: string, limit: number = 50): Promise<Meal[]> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return [];
    
    const result = await db.select()
      .from(meals)
      .where(eq(meals.userId, userIdNum))
      .orderBy(desc(meals.timestamp))
      .limit(limit);
    
    return result.map(record => ({
      _id: record.id.toString(),
      userId: userId,
      name: record.name,
      carbs: record.carbs,
      protein: record.protein ?? undefined,
      fat: record.fat ?? undefined,
      calories: record.calories ?? undefined,
      voiceRecorded: record.voiceRecorded,
      timestamp: record.timestamp,
    }));
  }

  // ==================== MEDICAL REPORT OPERATIONS ====================
  
  async getMedicalReportsByPatient(patientId: string): Promise<MedicalReport[]> {
    const patientIdNum = parseInt(patientId);
    if (isNaN(patientIdNum)) return [];
    
    const result = await db.select()
      .from(medicalReports)
      .where(eq(medicalReports.patientId, patientIdNum))
      .orderBy(desc(medicalReports.uploadedAt));
    
    return result.map(record => ({
      _id: record.id.toString(),
      patientId: record.patientId.toString(),
      fileName: record.fileName,
      fileUrl: record.fileUrl,
      fileType: record.fileType,
      fileSize: record.fileSize,
      uploadedBy: record.uploadedBy.toString(),
      description: record.description || undefined,
      uploadedAt: record.uploadedAt,
    }));
  }

  async getMedicalReportById(reportId: string): Promise<MedicalReport | null> {
    const reportIdNum = parseInt(reportId);
    if (isNaN(reportIdNum)) return null;
    
    const result = await db.select()
      .from(medicalReports)
      .where(eq(medicalReports.id, reportIdNum))
      .limit(1);
    
    if (result.length === 0) return null;
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      patientId: record.patientId.toString(),
      fileName: record.fileName,
      fileUrl: record.fileUrl,
      fileType: record.fileType,
      fileSize: record.fileSize,
      uploadedBy: record.uploadedBy.toString(),
      description: record.description || undefined,
      uploadedAt: record.uploadedAt,
    };
  }

  async createMedicalReport(patientId: string, uploaderId: string, report: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    description?: string;
  }): Promise<MedicalReport> {
    const patientIdNum = parseInt(patientId);
    const uploaderIdNum = parseInt(uploaderId);
    
    if (isNaN(patientIdNum) || isNaN(uploaderIdNum)) {
      throw new Error('Invalid patient ID or uploader ID');
    }
    
    const result = await db.insert(medicalReports).values({
      patientId: patientIdNum,
      fileName: report.fileName,
      fileUrl: report.fileUrl,
      fileType: report.fileType,
      fileSize: report.fileSize,
      uploadedBy: uploaderIdNum,
      description: report.description,
    }).returning();
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      patientId: record.patientId.toString(),
      fileName: record.fileName,
      fileUrl: record.fileUrl,
      fileType: record.fileType,
      fileSize: record.fileSize,
      uploadedBy: record.uploadedBy.toString(),
      description: record.description || undefined,
      uploadedAt: record.uploadedAt,
    };
  }

  // ==================== PREDICTION OPERATIONS ====================
  
  async createPrediction(userId: string, prediction: InsertPrediction): Promise<Prediction> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new Error('Invalid user ID');
    
    const result = await db.insert(predictions).values({
      userId: userIdNum,
      predictedInsulin: Math.round(prediction.predictedInsulin),
      confidence: Math.round(prediction.confidence * 100),
      factors: prediction.factors,
    }).returning();
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      predictedInsulin: record.predictedInsulin,
      confidence: record.confidence / 100,
      factors: record.factors,
      timestamp: record.timestamp,
    };
  }

  async getPredictionsByUser(userId: string, limit: number = 50): Promise<Prediction[]> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return [];
    
    const result = await db.select()
      .from(predictions)
      .where(eq(predictions.userId, userIdNum))
      .orderBy(desc(predictions.timestamp))
      .limit(limit);
    
    return result.map(record => ({
      _id: record.id.toString(),
      userId: userId,
      predictedInsulin: record.predictedInsulin,
      confidence: record.confidence / 100,
      factors: record.factors,
      timestamp: record.timestamp,
    }));
  }

  async getLatestPrediction(userId: string): Promise<Prediction | null> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return null;
    
    const result = await db.select()
      .from(predictions)
      .where(eq(predictions.userId, userIdNum))
      .orderBy(desc(predictions.timestamp))
      .limit(1);
    
    if (result.length === 0) return null;
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      predictedInsulin: record.predictedInsulin,
      confidence: record.confidence / 100,
      factors: record.factors,
      timestamp: record.timestamp,
    };
  }

  // User Profile Methods
  async createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new Error('Invalid user ID');
    
    const result = await db.insert(userProfiles).values({
      userId: userIdNum,
      dateOfBirth: profile.dateOfBirth || null,
      weight: profile.weight?.toString() || null,
      height: profile.height?.toString() || null,
      lastA1c: profile.lastA1c?.toString() || null,
      medications: profile.medications || null,
      typicalInsulin: profile.typicalInsulin?.toString() || null,
      targetRange: profile.targetRange || null,
    }).returning();
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      dateOfBirth: record.dateOfBirth || undefined,
      weight: record.weight ? parseFloat(record.weight) : undefined,
      height: record.height ? parseFloat(record.height) : undefined,
      lastA1c: record.lastA1c ? parseFloat(record.lastA1c) : undefined,
      medications: record.medications || undefined,
      typicalInsulin: record.typicalInsulin ? parseFloat(record.typicalInsulin) : undefined,
      targetRange: record.targetRange || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return null;
    
    const result = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userIdNum))
      .limit(1);
    
    if (result.length === 0) return null;
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      dateOfBirth: record.dateOfBirth || undefined,
      weight: record.weight ? parseFloat(record.weight) : undefined,
      height: record.height ? parseFloat(record.height) : undefined,
      lastA1c: record.lastA1c ? parseFloat(record.lastA1c) : undefined,
      medications: record.medications || undefined,
      typicalInsulin: record.typicalInsulin ? parseFloat(record.typicalInsulin) : undefined,
      targetRange: record.targetRange || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | null> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return null;
    
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (profile.dateOfBirth !== undefined) updateData.dateOfBirth = profile.dateOfBirth || null;
    if (profile.weight !== undefined) updateData.weight = profile.weight !== null && profile.weight !== undefined ? profile.weight.toString() : null;
    if (profile.height !== undefined) updateData.height = profile.height !== null && profile.height !== undefined ? profile.height.toString() : null;
    if (profile.lastA1c !== undefined) updateData.lastA1c = profile.lastA1c !== null && profile.lastA1c !== undefined ? profile.lastA1c.toString() : null;
    if (profile.medications !== undefined) updateData.medications = profile.medications || null;
    if (profile.typicalInsulin !== undefined) updateData.typicalInsulin = profile.typicalInsulin !== null && profile.typicalInsulin !== undefined ? profile.typicalInsulin.toString() : null;
    if (profile.targetRange !== undefined) updateData.targetRange = profile.targetRange || null;
    
    const result = await db.update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.userId, userIdNum))
      .returning();
    
    if (result.length === 0) return null;
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      dateOfBirth: record.dateOfBirth || undefined,
      weight: record.weight ? parseFloat(record.weight) : undefined,
      height: record.height ? parseFloat(record.height) : undefined,
      lastA1c: record.lastA1c ? parseFloat(record.lastA1c) : undefined,
      medications: record.medications || undefined,
      typicalInsulin: record.typicalInsulin ? parseFloat(record.typicalInsulin) : undefined,
      targetRange: record.targetRange || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  // Medication Methods
  async createMedication(userId: string, medication: InsertMedication): Promise<Medication> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) throw new Error('Invalid user ID');
    
    const result = await db.insert(medications).values({
      userId: userIdNum,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      timing: medication.timing || null,
      category: medication.category || null,
    }).returning();
    
    const record = result[0];
    return {
      _id: record.id.toString(),
      userId: userId,
      name: record.name,
      dosage: record.dosage,
      frequency: record.frequency,
      timing: record.timing || undefined,
      category: record.category || undefined,
      createdAt: record.createdAt,
    };
  }

  async getMedicationsByUser(userId: string): Promise<Medication[]> {
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) return [];
    
    const result = await db.select()
      .from(medications)
      .where(eq(medications.userId, userIdNum))
      .orderBy(desc(medications.createdAt));
    
    return result.map(record => ({
      _id: record.id.toString(),
      userId: userId,
      name: record.name,
      dosage: record.dosage,
      frequency: record.frequency,
      timing: record.timing || undefined,
      category: record.category || undefined,
      createdAt: record.createdAt,
    }));
  }

  async deleteMedication(userId: string, medicationId: string): Promise<boolean> {
    const userIdNum = parseInt(userId);
    const medIdNum = parseInt(medicationId);
    
    if (isNaN(userIdNum) || isNaN(medIdNum)) return false;
    
    const result = await db.delete(medications)
      .where(eq(medications.id, medIdNum))
      .returning();
    
    return result.length > 0;
  }
}

// Export the storage instance
export const storage = new DrizzleStorage();
