const mongoose = require('mongoose');

const apiRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      default: 'GET',
    },
    url: {
      type: String,
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    headers: [
      {
        key: { type: String },
        value: { type: String },
        isActive: { type: Boolean, default: true },
      },
    ],
    queryParams: [
      {
        key: { type: String },
        value: { type: String },
        isActive: { type: Boolean, default: true },
      },
    ],
    auth: {
      type: {
        type: String,
        enum: ['none', 'bearer', 'basic'],
        default: 'none',
      },
      token: { type: String },
      username: { type: String },
      password: { type: String },
    },
    body: {
      type: {
        type: String,
        enum: ['none', 'json', 'form-data', 'x-www-form-urlencoded', 'raw'],
        default: 'none',
      },
      content: { type: String },
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    response: {
      statusCode: Number,
      statusText: String,
      responseTime: Number,
      responseHeaders: Array,
      responseBody: String,
      responseSize: Number
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApiRequest', apiRequestSchema);
