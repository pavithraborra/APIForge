const mongoose = require('mongoose');

const requestHistorySchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApiRequest'
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    method: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    statusCode: {
      type: Number
    },
    statusText: {
      type: String
    },
    responseTime: {
      type: Number
    },
    requestHeaders: [
      { key: String, value: String }
    ],
    requestBody: {
      type: String
    },
    responseHeaders: [
      { key: String, value: String }
    ],
    responseBody: {
      type: String
    },
    responseSize: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RequestHistory', requestHistorySchema);
