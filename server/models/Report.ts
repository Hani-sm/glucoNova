import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    default: null,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  reviewStatus: {
    type: String,
    enum: ['pending', 'reviewed'],
    default: 'pending',
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  reviewedBy: {
    type: String,
    default: null,
  },
  aiSummary: {
    type: String,
    default: null,
  },
  extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  notes: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes for fast queries
reportSchema.index({ patientId: 1 });
reportSchema.index({ doctorId: 1 });
reportSchema.index({ uploadedAt: -1 });
reportSchema.index({ reviewStatus: 1 });

export const ReportModel = mongoose.model('Report', reportSchema);
