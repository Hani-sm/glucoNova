import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  fromUserId: {
    type: String,
    required: true,
  },
  toUserId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  attachments: [{
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
    },
    fileName: String,
    fileUrl: String,
  }],
  type: {
    type: String,
    enum: ['chat', 'system', 'report_shared'],
    default: 'chat',
  },
  readAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const MessageModel = mongoose.model('Message', messageSchema);
