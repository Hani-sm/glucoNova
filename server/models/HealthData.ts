import mongoose from 'mongoose';

const healthDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  glucose: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  insulin: {
    type: Number,
    required: true,
    min: 0,
    max: 200,
  },
  carbs: {
    type: Number,
    required: true,
    min: 0,
    max: 500,
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
  },
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

healthDataSchema.index({ userId: 1, timestamp: -1 });

export const HealthDataModel = mongoose.model('HealthData', healthDataSchema);
