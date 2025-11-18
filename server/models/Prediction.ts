import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  predictedInsulin: {
    type: Number,
    required: true,
    min: 0,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  factors: {
    glucose: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    activityLevel: {
      type: String,
      required: true,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

predictionSchema.index({ userId: 1, timestamp: -1 });

export const PredictionModel = mongoose.model('Prediction', predictionSchema);
