import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { authMiddleware, roleMiddleware, approvalMiddleware, authWithApproval, generateToken, type AuthRequest } from "./middleware/auth";
import { hashPassword, comparePassword } from "./utils/password";
import { insertUserSchema, loginSchema, healthDataSchema, mealSchema, insertUserProfileSchema, insertMedicationSchema } from "@shared/schema";

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
        isApproved: true,
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
  
  // PDF/Document parsing endpoint for extracting medical information
  app.post('/api/reports/parse', upload.single('file'), async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileType = req.file.mimetype;
      let extractedData: any = {};

      // Handle PDF files
      if (fileType === 'application/pdf') {
        try {
          const fs = await import('fs').then(m => m.promises);
          const pdfContent = await fs.readFile(req.file.path, 'utf-8').catch(() => null);
          
          // If we can't read as text, try binary extraction
          if (!pdfContent) {
            const pdfBuffer = await fs.readFile(req.file.path);
            // Extract text from PDF buffer
            const textContent = pdfBuffer.toString('binary').replace(/[^\x20-\x7E\n\r]/g, '');
            extractedData = parseMedicalDocument(textContent);
          } else {
            extractedData = parseMedicalDocument(pdfContent);
          }
        } catch (error) {
          console.error('PDF reading error:', error);
          extractedData = {};
        }
      } else if (fileType === 'image/jpeg' || fileType === 'image/png') {
        // For images, we would need OCR - for now return empty
        // In production, integrate with Tesseract.js or cloud OCR API
        extractedData = {};
      }

      // Ensure extracted data has the expected structure
      const responseData = {
        name: extractedData.name || '',
        dob: extractedData.dob || '',
        weight: extractedData.weight || '',
        height: extractedData.height || '',
        lastA1c: extractedData.lastA1c || '',
        medications: extractedData.medications || '',
        typicalInsulin: extractedData.typicalInsulin || '',
        targetRange: extractedData.targetRange || '70-180',
      };

      res.json(responseData);
    } catch (error: any) {
      console.error('Parse error:', error);
      res.status(500).json({ message: error.message || 'Failed to parse document' });
    }
  });
  
  // Helper function to parse medical document content
  function parseMedicalDocument(content: string): any {
    const data: any = {};
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lowerLine = line.toLowerCase();

      // Extract Name
      if ((lowerLine.includes('name') || lowerLine.includes('patient')) && !data.name) {
        const match = line.match(/(?:name|patient)[:\s]+([A-Za-z\s]+)(?:[,\d]|$)/i);
        if (match) data.name = match[1].trim();
      }

      // Extract Date of Birth
      if ((lowerLine.includes('dob') || lowerLine.includes('date of birth') || lowerLine.includes('birth date')) && !data.dob) {
        const match = line.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})|(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/i);
        if (match) {
          const dateStr = match[0];
          // Normalize to YYYY-MM-DD format
          const parts = dateStr.split(/[-\/]/);
          if (parts[0].length === 4) {
            data.dob = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else {
            data.dob = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
          }
        }
      }

      // Extract Weight
      if ((lowerLine.includes('weight')) && !data.weight) {
        const match = line.match(/weight[:\s]*([\d.]+)\s*(?:kg|lbs?|kilograms?|pounds?)?/i);
        if (match) data.weight = match[1];
      }

      // Extract Height
      if ((lowerLine.includes('height')) && !data.height) {
        const match = line.match(/height[:\s]*([\d.]+)\s*(?:cm|m|feet|ft|in)?/i);
        if (match) data.height = match[1];
      }

      // Extract A1C
      if ((lowerLine.includes('a1c') || lowerLine.includes('hba1c') || lowerLine.includes('hemoglobin')) && !data.lastA1c) {
        const match = line.match(/(?:a1c|hba1c|hemoglobin)[:\s]*([\d.]+)/i);
        if (match) data.lastA1c = match[1];
      }

      // Extract Medications
      if ((lowerLine.includes('medication') || lowerLine.includes('drug') || lowerLine.includes('prescription')) && !data.medications) {
        const match = line.match(/(?:medication|drug|prescription)[:\s]*([^,\n]+(?:,[^,\n]+)*)/i);
        if (match) data.medications = match[1].trim();
      }

      // Extract Typical Insulin
      if ((lowerLine.includes('insulin') || lowerLine.includes('dose')) && !data.typicalInsulin) {
        const match = line.match(/(?:insulin|dose)[:\s]*([\d.]+)\s*(?:units?|u)?/i);
        if (match) data.typicalInsulin = match[1];
      }

      // Extract Target Range
      if ((lowerLine.includes('target') || lowerLine.includes('range')) && !data.targetRange) {
        const match = line.match(/(\d{2,3})\s*[-–]\s*(\d{2,3})/i);
        if (match) data.targetRange = `${match[1]}-${match[2]}`;
      }
    }

    return data;
  }

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

  // Get patient details for a specific report
  app.get('/api/reports/:reportId/patient', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const { reportId } = req.params;
      
      // Get the report first to find the patient ID
      const report = await storage.getMedicalReportById(reportId);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      // Check authorization
      if (req.user!.role === 'patient' && report.patientId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Fetch patient details
      const patient = await storage.getUser(report.patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Return patient information (excluding sensitive password)
      res.json({
        patient: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
          role: patient.role,
          isApproved: patient.isApproved,
          createdAt: patient.createdAt,
        },
        report: {
          id: report._id,
          fileName: report.fileName,
          fileType: report.fileType,
          fileSize: report.fileSize,
          uploadedAt: report.uploadedAt,
          description: report.description,
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch patient details' });
    }
  });

  // User Profile Routes
  app.post('/api/profile', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      // Check if profile already exists
      const existing = await storage.getUserProfile(req.user!.userId);
      if (existing) {
        return res.status(409).json({ message: 'Profile already exists, use PUT to update' });
      }

      const validated = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(req.user!.userId, validated);
      res.status(201).json({ profile });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: error.message || 'Failed to create profile' });
    }
  });

  app.get('/api/profile', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const profile = await storage.getUserProfile(req.user!.userId);
      res.json({ profile });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch profile' });
    }
  });

  app.put('/api/profile', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const validated = insertUserProfileSchema.partial().parse(req.body);
      const profile = await storage.updateUserProfile(req.user!.userId, validated);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json({ profile });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: error.message || 'Failed to update profile' });
    }
  });

  // ==================== MEDICATION ROUTES ====================
  
  app.post('/api/medications', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const validated = insertMedicationSchema.parse(req.body);
      const medication = await storage.createMedication(req.user!.userId, validated);
      res.status(201).json({ 
        message: 'Medication added successfully',
        medication 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: error.message || 'Failed to add medication' });
    }
  });

  app.get('/api/medications', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const medications = await storage.getMedicationsByUser(req.user!.userId);
      res.json({ medications });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch medications' });
    }
  });

  app.delete('/api/medications/:id', authWithApproval, async (req: AuthRequest, res: any) => {
    try {
      const success = await storage.deleteMedication(req.user!.userId, req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Medication not found' });
      }
      res.json({ message: 'Medication deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to delete medication' });
    }
  });

  // ==================== ANALYTICS ROUTES ====================

  app.get('/api/analytics/glucose-stats', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.query.userId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && userId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const healthData = await storage.getHealthDataByUser(userId, 100);
      
      if (healthData.length === 0) {
        return res.json({
          avgGlucose: 0,
          minGlucose: 0,
          maxGlucose: 0,
          timeInRange: 0,
          highReadings: 0,
          lowReadings: 0,
          variance: 0,
        });
      }

      const glucoseLevels = healthData.map(d => d.glucose);
      const avgGlucose = Math.round(glucoseLevels.reduce((a, b) => a + b, 0) / glucoseLevels.length);
      const minGlucose = Math.min(...glucoseLevels);
      const maxGlucose = Math.max(...glucoseLevels);
      const timeInRange = healthData.filter(d => d.glucose >= 70 && d.glucose <= 180).length;
      const highReadings = healthData.filter(d => d.glucose > 180).length;
      const lowReadings = healthData.filter(d => d.glucose < 70).length;
      
      const variance = Math.round(
        glucoseLevels.reduce((sum, g) => sum + Math.pow(g - avgGlucose, 2), 0) / glucoseLevels.length
      );

      res.json({
        avgGlucose,
        minGlucose,
        maxGlucose,
        timeInRange: Math.round((timeInRange / healthData.length) * 100),
        highReadings,
        lowReadings,
        variance,
        totalReadings: healthData.length,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to calculate statistics' });
    }
  });

  app.get('/api/analytics/meal-summary', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.query.userId as string || req.user!.userId;
      
      if (req.user!.role === 'patient' && userId !== req.user!.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const meals = await storage.getMealsByUser(userId, 100);
      
      if (meals.length === 0) {
        return res.json({
          avgDailyCarbs: 0,
          totalMealsLogged: 0,
          voiceLogged: 0,
          avgCarbs: 0,
          avgProtein: 0,
          avgFat: 0,
        });
      }

      const avgCarbs = Math.round(meals.reduce((sum, m) => sum + m.carbs, 0) / meals.length);
      const avgProtein = Math.round(meals.filter(m => m.protein).reduce((sum, m) => sum + (m.protein || 0), 0) / meals.length);
      const avgFat = Math.round(meals.filter(m => m.fat).reduce((sum, m) => sum + (m.fat || 0), 0) / meals.length);
      const voiceLogged = meals.filter(m => m.voiceRecorded).length;

      res.json({
        totalMealsLogged: meals.length,
        voiceLogged,
        avgCarbs,
        avgProtein,
        avgFat,
        avgDailyCarbs: Math.round(avgCarbs * 3),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to calculate meal summary' });
    }
  });

  // ==================== HEALTH INSIGHTS ====================

  app.get('/api/insights/recommendations', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.userId;
      const healthData = await storage.getHealthDataByUser(userId, 30);
      const meals = await storage.getMealsByUser(userId, 30);
      const profile = await storage.getUserProfile(userId);

      const recommendations: string[] = [];

      if (healthData.length > 0) {
        const lowReadings = healthData.filter(d => d.glucose < 70).length;
        const highReadings = healthData.filter(d => d.glucose > 180).length;
        const avgGlucose = Math.round(healthData.reduce((sum, d) => sum + d.glucose, 0) / healthData.length);

        if (lowReadings > 0) {
          recommendations.push('You have had several low glucose readings. Consider increasing carb intake or reducing insulin dose.');
        }
        if (highReadings > 0) {
          recommendations.push('You have had several high glucose readings. Consider reducing carb intake or increasing insulin dose.');
        }
        if (avgGlucose > 150) {
          recommendations.push('Your average glucose is above target. Consult your doctor about adjusting your medication.');
        }
      }

      if (meals.length === 0 && healthData.length > 0) {
        recommendations.push('Consider logging your meals to help predict insulin needs more accurately.');
      }

      if (!profile || !profile.weight) {
        recommendations.push('Complete your health profile for more personalized recommendations.');
      }

      if (recommendations.length === 0) {
        recommendations.push('Great job maintaining good glucose control! Keep up the excellent work.');
      }

      res.json({ recommendations });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to generate recommendations' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
