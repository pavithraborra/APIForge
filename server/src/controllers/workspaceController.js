const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Collection = require('../models/Collection');
const ApiRequest = require('../models/ApiRequest');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, color, avatar } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Workspace name is required' });
    }

    const workspace = await Workspace.create({
      name,
      description,
      color,
      avatar,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'Owner' }]
    });

    await Activity.create({
      user: req.user._id,
      workspace: workspace._id,
      action: 'created_workspace',
      entityType: 'workspace',
      entityId: workspace._id,
      entityName: workspace.name
    });

    res.status(201).json({ success: true, data: workspace });
  } catch (error) {
    console.error('Create workspace error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating workspace' });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    })
      .populate('owner', 'username email profilePicture')
      .skip(skip)
      .limit(limit);

    const total = await Workspace.countDocuments({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    res.status(200).json({ success: true, count: workspaces.length, total, page, limit, data: workspaces });
  } catch (error) {
    console.error('Get workspaces error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching workspaces' });
  }
};

exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'username email profilePicture')
      .populate('members.user', 'username email profilePicture role');

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    console.error('Get workspace by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching workspace' });
  }
};

exports.updateWorkspace = async (req, res) => {
  try {
    let workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await Activity.create({
      user: req.user._id,
      workspace: workspace._id,
      action: 'updated_workspace',
      entityType: 'workspace',
      entityId: workspace._id,
      entityName: workspace.name
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    console.error('Update workspace error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating workspace' });
  }
};

exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    await Workspace.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete workspace error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting workspace' });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email address' });
    }

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    if (workspace.members.some(m => m.user.toString() === user._id.toString())) {
      return res.status(400).json({ success: false, message: 'User is already a member of this workspace' });
    }

    workspace.members.push({ user: user._id, role: role || 'Viewer' });
    await workspace.save();

    await Activity.create({
      user: req.user._id,
      workspace: workspace._id,
      action: 'invited_member',
      entityType: 'member',
      entityId: user._id,
      entityName: user.username,
      details: `Role: ${role || 'Viewer'}`
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    console.error('Invite member error:', error);
    return res.status(500).json({ success: false, message: 'Server error inviting member' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    if (workspace.owner.toString() === req.params.userId) {
      return res.status(400).json({ success: false, message: 'Cannot remove the workspace owner' });
    }

    workspace.members = workspace.members.filter(
      m => m.user.toString() !== req.params.userId
    );

    await workspace.save();

    await Activity.create({
      user: req.user._id,
      workspace: workspace._id,
      action: 'removed_member',
      entityType: 'member',
      entityId: req.params.userId,
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    console.error('Remove member error:', error);
    return res.status(500).json({ success: false, message: 'Server error removing member' });
  }
};

exports.updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    if (workspace.owner.toString() === req.params.userId) {
      return res.status(400).json({ success: false, message: 'Cannot change the role of the workspace owner' });
    }

    const memberIndex = workspace.members.findIndex(
      m => m.user.toString() === req.params.userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found in this workspace' });
    }

    workspace.members[memberIndex].role = role;
    await workspace.save();

    await Activity.create({
      user: req.user._id,
      workspace: workspace._id,
      action: 'changed_role',
      entityType: 'member',
      entityId: req.params.userId,
      details: `New Role: ${role}`
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    console.error('Update member role error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating member role' });
  }
};

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const workspace = await Workspace.findById(req.params.id)
      .populate({
        path: 'members.user',
        select: 'username email profilePicture lastActive',
        options: { skip, limit }
      });

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const total = workspace.members.length;
    const members = workspace.members.slice(skip, skip + limit);

    res.status(200).json({ success: true, count: members.length, total, page, limit, data: members });
  } catch (error) {
    console.error('Get workspace members error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching members' });
  }
};

exports.getWorkspaceAnalytics = async (req, res) => {
  try {
    const workspaceId = req.params.id;

    const collectionsCount = await Collection.countDocuments({ workspace: workspaceId });
    const requestsCount = await ApiRequest.countDocuments({ workspaceId: workspaceId });
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found' });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivityCount = await Activity.countDocuments({
      workspace: workspaceId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // HTTP method distribution
    let methodDist = [];
    try {
      methodDist = await ApiRequest.aggregate([
        { $match: { workspaceId: new mongoose.Types.ObjectId(workspaceId) } },
        { $group: { _id: '$method', count: { $sum: 1 } } }
      ]);
    } catch (aggError) {
      console.error('Aggregation error:', aggError);
    }

    res.status(200).json({
      success: true,
      data: {
        collectionsCount,
        requestsCount,
        membersCount: workspace.members.length,
        recentActivityCount,
        methodDistribution: methodDist
      }
    });
  } catch (error) {
    console.error('Get workspace analytics error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};
