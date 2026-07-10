const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    avatar: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#E78F81'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['Owner', 'Admin', 'Developer', 'Viewer'],
          default: 'Viewer',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workspace', workspaceSchema);
