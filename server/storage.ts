import { type User, type InsertUser, type HealthData, type InsertHealthData, type Meal, type InsertMeal } from "@shared/schema";
import { UserModel } from "./models/User";
import { HealthDataModel } from "./models/HealthData";
import { MealModel } from "./models/Meal";
import { isMongoConnected } from "./db";
import { randomUUID } from "crypto";

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
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean();
    return user ? { ...user, _id: user._id.toString() } as User : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();
    return user ? { ...user, _id: user._id.toString() } as User : null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create(insertUser);
    return { ...user.toObject(), _id: user._id.toString() } as User;
  }

  async updateUserApproval(id: string, isApproved: boolean): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    ).lean();
    return user ? { ...user, _id: user._id.toString() } as User : null;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().lean();
    return users.map(user => ({ ...user, _id: user._id.toString() } as User));
  }

  async createHealthData(userId: string, data: InsertHealthData): Promise<HealthData> {
    const healthData = await HealthDataModel.create({ userId, ...data });
    return { ...healthData.toObject(), _id: healthData._id.toString(), userId: userId } as HealthData;
  }

  async getHealthDataByUser(userId: string, limit: number = 50): Promise<HealthData[]> {
    const data = await HealthDataModel.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return data.map(d => ({ ...d, _id: d._id.toString(), userId: userId } as HealthData));
  }

  async getLatestHealthData(userId: string): Promise<HealthData | null> {
    const data = await HealthDataModel.findOne({ userId })
      .sort({ timestamp: -1 })
      .lean();
    return data ? { ...data, _id: data._id.toString(), userId: userId } as HealthData : null;
  }

  async createMeal(userId: string, meal: InsertMeal): Promise<Meal> {
    const mealData = await MealModel.create({ userId, ...meal });
    return { ...mealData.toObject(), _id: mealData._id.toString(), userId: userId } as Meal;
  }

  async getMealsByUser(userId: string, limit: number = 50): Promise<Meal[]> {
    const meals = await MealModel.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return meals.map(m => ({ ...m, _id: m._id.toString(), userId: userId } as Meal));
  }
}

class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private healthData: Map<string, HealthData[]> = new Map();
  private meals: Map<string, Meal[]> = new Map();

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      _id: id,
      ...insertUser,
      isApproved: insertUser.role === 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserApproval(id: string, isApproved: boolean): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    user.isApproved = isApproved;
    user.updatedAt = new Date();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createHealthData(userId: string, data: InsertHealthData): Promise<HealthData> {
    const healthData: HealthData = {
      _id: randomUUID(),
      userId,
      ...data,
      timestamp: new Date(),
    };
    const userHealthData = this.healthData.get(userId) || [];
    userHealthData.unshift(healthData);
    this.healthData.set(userId, userHealthData);
    return healthData;
  }

  async getHealthDataByUser(userId: string, limit: number = 50): Promise<HealthData[]> {
    const data = this.healthData.get(userId) || [];
    return data.slice(0, limit);
  }

  async getLatestHealthData(userId: string): Promise<HealthData | null> {
    const data = this.healthData.get(userId) || [];
    return data[0] || null;
  }

  async createMeal(userId: string, meal: InsertMeal): Promise<Meal> {
    const mealData: Meal = {
      _id: randomUUID(),
      userId,
      ...meal,
      timestamp: new Date(),
    };
    const userMeals = this.meals.get(userId) || [];
    userMeals.unshift(mealData);
    this.meals.set(userId, userMeals);
    return mealData;
  }

  async getMealsByUser(userId: string, limit: number = 50): Promise<Meal[]> {
    const meals = this.meals.get(userId) || [];
    return meals.slice(0, limit);
  }
}

export const storage = isMongoConnected() ? new MongoStorage() : new MemStorage();
