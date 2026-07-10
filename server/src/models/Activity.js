const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    action: {
      type: String,
      enum: [
        'created_workspace', 'updated_workspace', 'deleted_workspace',
        'created_collection', 'updated_collection', 'deleted_collection',
        'created_request', 'updated_request', 'deleted_request', 'executed_request',
        'invited_member', 'removed_member', 'changed_role',
        'created_environment', 'updated_environment', 'deleted_environment'
      ],
      required: true
    },
    entityType: {
      type: String,
      enum: ['workspace', 'collection', 'request', 'environment', 'member'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    },
    entityName: {
      type: String
    },
    details: {
      type: String
    },
    ipAddress: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
