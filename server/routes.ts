import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { authMiddleware, roleMiddleware, approvalMiddleware, authWithApproval, generateToken, type AuthRequest } from "./middleware/auth";
import { hashPassword, comparePassword } from "./utils/password";
import { insertUserSchema, loginSchema, healthDataSchema, mealSchema } from "@shared/schema";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      const token = generateToken(user._id, user.role, user.isApproved);

      res.status(201).json({
        message: 'Registration successful. You can now login.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await comparePassword(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.role, user.isApproved);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Login failed' });
    }
  });

  app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch user' });
    }
  });

  // ==================== HEALTH DATA ROUTES ====================
  
  app.post('/api/health-data', authMiddleware, roleMiddleware('patient'), async (req: AuthRequest, res) => {
    try {
      const validatedData = healthDataSchema.parse(req.body);
      const healthData = await storage.createHealthData(req.user!.userId, validatedData);
      
      res.status(201).json({ message: 'Health data recorded successfully', data: healthData });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to record health data' });
    }
  });

  app.get('/api/health-data', authMiddleware, roleMiddleware('patient', 'doctor'), async (req: AuthRequest, res) => {
    try {
      const userId = req.query.userId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && userId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const healthData = await storage.getHealthDataByUser(userId);
      res.json({ data: healthData });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch health data' });
    }
  });

  app.get('/api/health-data/latest', authMiddleware, roleMiddleware('patient'), async (req: AuthRequest, res) => {
    try {
      const latestData = await storage.getLatestHealthData(req.user!.userId);
      res.json({ data: latestData });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch latest health data' });
    }
  });

  // ==================== MEAL ROUTES ====================
  
  app.post('/api/meals', authMiddleware, roleMiddleware('patient'), async (req: AuthRequest, res) => {
    try {
      const validatedData = mealSchema.parse(req.body);
      const meal = await storage.createMeal(req.user!.userId, validatedData);
      
      res.status(201).json({ message: 'Meal logged successfully', data: meal });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to log meal' });
    }
  });

  app.get('/api/meals', authMiddleware, roleMiddleware('patient', 'doctor'), async (req: AuthRequest, res) => {
    try {
      const userId = req.query.userId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && userId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const meals = await storage.getMealsByUser(userId);
      res.json({ data: meals });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch meals' });
    }
  });

  // ==================== PREDICTION ROUTES ====================
  
  app.post('/api/predictions/insulin', authMiddleware, roleMiddleware('patient'), async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.userId;
      
      const recentHealthData = await storage.getHealthDataByUser(userId, 10);
      const recentMeals = await storage.getMealsByUser(userId, 10);
      
      if (recentHealthData.length === 0) {
        return res.status(400).json({ 
          message: 'Insufficient health data for prediction. Please log at least one health entry first.' 
        });
      }

      const latestData = recentHealthData[0];
      const factors: string[] = [];
      let predictedInsulin = 0;
      
      const baseConfidence = recentHealthData.length >= 5 ? 0.6 : 0.4;
      let confidence = baseConfidence;

      const avgGlucose = recentHealthData.reduce((sum, d) => sum + d.glucose, 0) / recentHealthData.length;
      const avgInsulin = recentHealthData.reduce((sum, d) => sum + (d.insulin || 0), 0) / recentHealthData.length;
      
      const recentMealSlice = recentMeals.slice(0, 3);
      const recentCarbs = recentMealSlice.length > 0 
        ? recentMealSlice.reduce((sum, m) => sum + m.carbs, 0) / recentMealSlice.length
        : 0;
      const totalMealCount = recentMeals.length;

      if (latestData.glucose > 180) {
        const correctionFactor = (latestData.glucose - 180) / 50;
        predictedInsulin += correctionFactor * 2;
        factors.push(`High glucose level (${latestData.glucose} mg/dL) requires correction dose`);
        if (recentHealthData.length >= 5) confidence += 0.1;
      } else if (latestData.glucose < 100) {
        factors.push(`Low glucose level (${latestData.glucose} mg/dL) - minimal insulin recommended`);
        predictedInsulin = Math.max(0, predictedInsulin - 1);
        if (recentHealthData.length >= 5) confidence += 0.05;
      } else {
        factors.push(`Normal glucose level (${latestData.glucose} mg/dL)`);
        if (recentHealthData.length >= 5) confidence += 0.05;
      }

      if (recentCarbs > 0 && recentMealSlice.length > 0) {
        const carbRatio = 15;
        const carbInsulin = recentCarbs / carbRatio;
        predictedInsulin += carbInsulin;
        factors.push(`Recent carb intake (~${Math.round(recentCarbs)}g) requires ${carbInsulin.toFixed(1)} units`);
        if (recentMealSlice.length >= 3) confidence += 0.15;
      }

      if (recentHealthData.length >= 3) {
        if (latestData.activityLevel === 'high') {
          predictedInsulin *= 0.85;
          factors.push('High activity level - reducing insulin dose by 15%');
          confidence += 0.05;
        } else if (latestData.activityLevel === 'low') {
          predictedInsulin *= 1.05;
          factors.push('Low activity level - slightly increasing insulin dose');
          confidence += 0.05;
        }
      }

      if (avgInsulin > 0 && recentHealthData.length >= 7) {
        const historicalWeight = 0.3;
        predictedInsulin = predictedInsulin * (1 - historicalWeight) + avgInsulin * historicalWeight;
        factors.push(`Historical average insulin (${avgInsulin.toFixed(1)} units) considered`);
        confidence += 0.1;
      }

      predictedInsulin = Math.max(0, Math.round(predictedInsulin * 10) / 10);
      
      let maxConfidence = 0.5;
      if (recentHealthData.length >= 5 && totalMealCount >= 2) {
        maxConfidence = 0.7;
      }
      if (recentHealthData.length >= 10 && totalMealCount >= 5) {
        maxConfidence = 0.85;
      }
      confidence = Math.min(maxConfidence, confidence);

      const prediction = await storage.createPrediction(userId, {
        predictedInsulin,
        confidence,
        factors,
      });

      res.status(201).json({ 
        message: 'Insulin prediction generated successfully',
        prediction: {
          predictedInsulin: prediction.predictedInsulin,
          confidence: prediction.confidence,
          factors: prediction.factors,
          timestamp: prediction.timestamp,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to generate prediction' });
    }
  });

  app.get('/api/predictions/latest', authMiddleware, roleMiddleware('patient', 'doctor'), async (req: AuthRequest, res) => {
    try {
      const userId = req.query.userId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && userId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const prediction = await storage.getLatestPrediction(userId);
      res.json({ prediction });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch latest prediction' });
    }
  });

  app.get('/api/predictions', authMiddleware, roleMiddleware('patient', 'doctor'), async (req: AuthRequest, res) => {
    try {
      const userId = req.query.userId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && userId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const predictions = await storage.getPredictionsByUser(userId);
      res.json({ predictions });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch predictions' });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  app.get('/api/admin/users', authMiddleware, roleMiddleware('admin'), async (req: AuthRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      const sanitizedUsers = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        createdAt: user.createdAt,
      }));
      
      res.json({ users: sanitizedUsers });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch users' });
    }
  });

  app.patch('/api/admin/users/:id/approve', authMiddleware, roleMiddleware('admin'), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;
      
      const user = await storage.updateUserApproval(id, isApproved);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User approval status updated', user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      }});
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to update user approval' });
    }
  });

  // ==================== DOCTOR ROUTES ====================
  
  app.get('/api/doctor/patients', authMiddleware, roleMiddleware('doctor'), async (req: AuthRequest, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const patients = allUsers
        .filter(user => user.role === 'patient' && user.isApproved)
        .map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        }));
      
      res.json({ patients });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch patients' });
    }
  });

  // ==================== FILE UPLOAD ROUTES ====================
  
  app.post('/api/reports/upload', authWithApproval, upload.single('file'), async (req: AuthRequest, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { patientId, description } = req.body;
      
      if (req.user!.role === 'patient' && patientId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const report = await storage.createMedicalReport(
        patientId || req.user!.userId,
        req.user!.userId,
        {
          fileName: req.file.originalname,
          fileUrl: req.file.path,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
          description,
        }
      );

      res.status(201).json({ 
        message: 'Report uploaded successfully',
        report: {
          id: report._id,
          fileName: report.fileName,
          fileType: report.fileType,
          uploadedAt: report.uploadedAt,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to upload report' });
    }
  });

  app.get('/api/reports', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const patientId = req.query.patientId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && patientId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const reports = await storage.getMedicalReportsByPatient(patientId);

      res.json({ reports });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch reports' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
