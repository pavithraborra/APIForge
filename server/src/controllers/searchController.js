const Workspace = require('../models/Workspace');
const Collection = require('../models/Collection');
const ApiRequest = require('../models/ApiRequest');
const User = require('../models/User');

exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, data: { workspaces: [], collections: [], requests: [], users: [] } });
    }

    const regex = new RegExp(q, 'i');

    const userWorkspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).select('_id name');

    const workspaceIds = userWorkspaces.map(ws => ws._id);

    const workspaces = await Workspace.find({
      _id: { $in: workspaceIds },
      name: regex
    }).select('name avatar owner').limit(5);

    const collections = await Collection.find({
      workspace: { $in: workspaceIds },
      name: regex
    }).select('name workspace').populate('workspace', 'name').limit(10);

    const requests = await ApiRequest.find({
      workspaceId: { $in: workspaceIds },
      $or: [
        { name: regex },
        { url: regex }
      ]
    }).select('name method url workspaceId collectionId').populate('workspaceId', 'name').limit(10);

    // Find users in shared workspaces
    let memberIds = new Set();
    for (const ws of userWorkspaces) {
      const fullWs = await Workspace.findById(ws._id);
      if (fullWs) {
        fullWs.members.forEach(m => memberIds.add(m.user.toString()));
        memberIds.add(fullWs.owner.toString());
      }
    }

    const users = await User.find({
      _id: { $in: Array.from(memberIds) },
      $or: [
        { username: regex },
        { email: regex }
      ]
    }).select('username email profilePicture').limit(5);

    res.status(200).json({
      success: true,
      data: {
        workspaces,
        collections,
        requests,
        users
      }
    });
  } catch (error) {
    console.error('Global search error:', error);
    return res.status(500).json({ success: false, message: 'Server error during search' });
  }
};
