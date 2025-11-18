import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
    min: 0,
  },
  protein: {
    type: Number,
    min: 0,
  },
  fat: {
    type: Number,
    min: 0,
  },
  calories: {
    type: Number,
    min: 0,
  },
  voiceRecorded: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

mealSchema.index({ userId: 1, timestamp: -1 });

export const MealModel = mongoose.model('Meal', mealSchema);
