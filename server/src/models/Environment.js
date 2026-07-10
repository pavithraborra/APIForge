const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    type: {
      type: String,
      enum: ['development', 'testing', 'production'],
      default: 'development'
    },
    variables: [
      {
        key: { type: String, required: true },
        value: { type: String },
        isActive: { type: Boolean, default: true }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Environment', environmentSchema);
