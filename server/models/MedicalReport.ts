import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  fileSize: {
    type: Number,
    required: true,
    max: 20 * 1024 * 1024, // 20MB max
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

medicalReportSchema.index({ patientId: 1, uploadedAt: -1 });

export const MedicalReportModel = mongoose.model('MedicalReport', medicalReportSchema);
