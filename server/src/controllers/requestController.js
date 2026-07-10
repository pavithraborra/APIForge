const ApiRequest = require('../models/ApiRequest');
const RequestHistory = require('../models/RequestHistory');
const Activity = require('../models/Activity');
const axios = require('axios');

exports.createRequest = async (req, res) => {
  try {
    const { name, method, url, collectionId, workspaceId, headers, queryParams, auth, body } = req.body;

    if (!name || !url || !collectionId || !workspaceId) {
      return res.status(400).json({ success: false, message: 'name, url, collectionId, and workspaceId are required' });
    }

    const apiRequest = await ApiRequest.create({
      name,
      method: method || 'GET',
      url,
      collectionId,
      workspaceId,
      headers: headers || [],
      queryParams: queryParams || [],
      auth: auth || { type: 'none' },
      body: body || { type: 'none' },
      createdBy: req.user._id
    });

    await Activity.create({
      user: req.user._id,
      workspace: workspaceId,
      action: 'created_request',
      entityType: 'request',
      entityId: apiRequest._id,
      entityName: apiRequest.name
    });

    res.status(201).json({ success: true, data: apiRequest });
  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating request' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await ApiRequest.find({ collectionId: req.params.collectionId });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('Get requests error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching requests' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await ApiRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error('Get request by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching request' });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    let apiRequest = await ApiRequest.findById(req.params.id);

    if (!apiRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    apiRequest = await ApiRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await Activity.create({
      user: req.user._id,
      workspace: apiRequest.workspaceId,
      action: 'updated_request',
      entityType: 'request',
      entityId: apiRequest._id,
      entityName: apiRequest.name
    });

    res.status(200).json({ success: true, data: apiRequest });
  } catch (error) {
    console.error('Update request error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating request' });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const apiRequest = await ApiRequest.findById(req.params.id);

    if (!apiRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    await ApiRequest.findByIdAndDelete(req.params.id);

    await Activity.create({
      user: req.user._id,
      workspace: apiRequest.workspaceId,
      action: 'deleted_request',
      entityType: 'request',
      entityId: apiRequest._id,
      entityName: apiRequest.name
    });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete request error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting request' });
  }
};

exports.duplicateRequest = async (req, res) => {
  try {
    const apiRequest = await ApiRequest.findById(req.params.id);

    if (!apiRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const requestData = apiRequest.toObject();
    delete requestData._id;
    delete requestData.createdAt;
    delete requestData.updatedAt;

    requestData.name = `${requestData.name} (Copy)`;
    requestData.createdBy = req.user._id;

    const newRequest = await ApiRequest.create(requestData);

    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    console.error('Duplicate request error:', error);
    return res.status(500).json({ success: false, message: 'Server error duplicating request' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const request = await ApiRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    request.isFavorite = !request.isFavorite;
    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.executeRequest = async (req, res) => {
  try {
    const apiRequest = await ApiRequest.findById(req.params.id);

    if (!apiRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Construct Axios config
    const axiosConfig = {
      method: apiRequest.method.toLowerCase(),
      url: apiRequest.url,
      headers: {},
      params: {},
      data: undefined,
      validateStatus: () => true, // Allow all status codes
      timeout: 30000
    };

    // Build headers
    if (apiRequest.headers && apiRequest.headers.length > 0) {
      apiRequest.headers.filter(h => h.isActive && h.key).forEach(h => {
        axiosConfig.headers[h.key] = h.value;
      });
    }

    // Auth
    if (apiRequest.auth && apiRequest.auth.type === 'bearer' && apiRequest.auth.token) {
      axiosConfig.headers['Authorization'] = `Bearer ${apiRequest.auth.token}`;
    } else if (apiRequest.auth && apiRequest.auth.type === 'basic' && apiRequest.auth.username) {
      const token = Buffer.from(`${apiRequest.auth.username}:${apiRequest.auth.password || ''}`).toString('base64');
      axiosConfig.headers['Authorization'] = `Basic ${token}`;
    }

    // Query params
    if (apiRequest.queryParams && apiRequest.queryParams.length > 0) {
      apiRequest.queryParams.filter(p => p.isActive && p.key).forEach(p => {
        axiosConfig.params[p.key] = p.value;
      });
    }

    // Body
    if (apiRequest.body && apiRequest.body.type !== 'none' && apiRequest.body.content) {
      if (apiRequest.body.type === 'json') {
        try {
          axiosConfig.data = JSON.parse(apiRequest.body.content);
          axiosConfig.headers['Content-Type'] = 'application/json';
        } catch (e) {
          axiosConfig.data = apiRequest.body.content;
        }
      } else {
        axiosConfig.data = apiRequest.body.content;
      }
    }

    const startTime = Date.now();
    let responseData;

    try {
      const response = await axios(axiosConfig);
      const endTime = Date.now();

      let bodyStr;
      if (typeof response.data === 'object') {
        try { bodyStr = JSON.stringify(response.data, null, 2); } catch { bodyStr = String(response.data); }
      } else {
        bodyStr = String(response.data);
      }

      const responseSize = Buffer.byteLength(bodyStr, 'utf8');

      responseData = {
        statusCode: response.status,
        statusText: response.statusText,
        responseTime: endTime - startTime,
        responseHeaders: Object.entries(response.headers || {}).map(([k, v]) => ({ key: k, value: v })),
        responseBody: bodyStr,
        responseSize
      };
    } catch (execError) {
      const endTime = Date.now();
      responseData = {
        statusCode: execError.response ? execError.response.status : 0,
        statusText: execError.response ? execError.response.statusText : 'Network Error',
        responseTime: endTime - startTime,
        responseHeaders: execError.response ? Object.entries(execError.response.headers || {}).map(([k, v]) => ({ key: k, value: v })) : [],
        responseBody: execError.response && execError.response.data
          ? (typeof execError.response.data === 'object' ? JSON.stringify(execError.response.data, null, 2) : String(execError.response.data))
          : execError.message,
        responseSize: 0
      };
    }

    // Save response to request document
    apiRequest.response = responseData;
    await apiRequest.save();

    // Save to history
    try {
      await RequestHistory.create({
        request: apiRequest._id,
        workspace: apiRequest.workspaceId,
        executedBy: req.user._id,
        method: apiRequest.method,
        url: apiRequest.url,
        statusCode: responseData.statusCode,
        statusText: responseData.statusText,
        responseTime: responseData.responseTime,
        responseSize: responseData.responseSize,
        requestHeaders: Object.entries(axiosConfig.headers).map(([k, v]) => ({ key: k, value: v })),
        requestBody: axiosConfig.data ? (typeof axiosConfig.data === 'object' ? JSON.stringify(axiosConfig.data) : axiosConfig.data) : ''
      });
    } catch (histErr) {
      console.error('Failed to save history:', histErr);
    }

    // Create activity
    try {
      await Activity.create({
        user: req.user._id,
        workspace: apiRequest.workspaceId,
        action: 'executed_request',
        entityType: 'request',
        entityId: apiRequest._id,
        entityName: apiRequest.name,
        details: `${apiRequest.method} ${apiRequest.url} - ${responseData.statusCode}`
      });
    } catch (actErr) {
      console.error('Failed to save activity:', actErr);
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Execute request error:', error);
    return res.status(500).json({ success: false, message: 'Server error executing request' });
  }
};
