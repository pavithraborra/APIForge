const RequestHistory = require('../models/RequestHistory');

exports.getHistory = async (req, res) => {
  try {
    const { method, url, startDate, endDate, limit = 50, page = 1 } = req.query;

    let query = { workspace: req.params.workspaceId };

    if (method) query.method = method;
    if (url) query.url = { $regex: url, $options: 'i' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const history = await RequestHistory.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('executedBy', 'username profilePicture')
      .populate('request', 'name');

    const total = await RequestHistory.countDocuments(query);

    res.status(200).json({
      success: true,
      count: history.length,
      total,
      data: history
    });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};

exports.getHistoryById = async (req, res) => {
  try {
    const history = await RequestHistory.findById(req.params.id)
      .populate('executedBy', 'username')
      .populate('request', 'name collectionId');

    if (!history) {
      return res.status(404).json({ success: false, message: 'History record not found' });
    }

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Get history by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching history record' });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const history = await RequestHistory.findById(req.params.id);

    if (!history) {
      return res.status(404).json({ success: false, message: 'History record not found' });
    }

    await RequestHistory.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete history error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting history record' });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await RequestHistory.deleteMany({ workspace: req.params.workspaceId });
    res.status(200).json({ success: true, message: 'History cleared for workspace' });
  } catch (error) {
    console.error('Clear history error:', error);
    return res.status(500).json({ success: false, message: 'Server error clearing history' });
  }
};
