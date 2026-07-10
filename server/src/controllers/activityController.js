const Activity = require('../models/Activity');
const Workspace = require('../models/Workspace');

exports.getActivities = async (req, res) => {
  try {
    const { action, limit = 50, page = 1 } = req.query;

    let query = { workspace: req.params.workspaceId };

    if (action) {
      query.action = action;
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'username profilePicture');

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      data: activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching activities' });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).select('_id');

    const workspaceIds = workspaces.map(ws => ws._id);

    const activities = await Activity.find({ workspace: { $in: workspaceIds } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'username profilePicture')
      .populate('workspace', 'name avatar');

    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    console.error('Get recent activities error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching recent activities' });
  }
};
