import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true,
    },
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  lastMessageText: String,
  lastMessageTime: Date,
  unreadCountForDoctor: {
    type: Number,
    default: 0,
  },
  unreadCountForPatient: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure unique conversation per participant pair
conversationSchema.index({ 'participants.userId': 1 });

export const ConversationModel = mongoose.model('Conversation', conversationSchema);
