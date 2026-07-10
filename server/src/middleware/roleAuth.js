const Workspace = require('../models/Workspace');

// Check global role (system wide)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'none'} is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check workspace specific role
const workspaceAuthorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId || (req.body && req.body.workspaceId) || req.params.id;

      if (!workspaceId) {
        return res.status(400).json({ success: false, message: 'Workspace ID is required' });
      }

      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {
        return res.status(404).json({ success: false, message: 'Workspace not found' });
      }

      // Owner of the workspace always has all permissions
      if (workspace.owner.toString() === req.user._id.toString()) {
        return next();
      }

      // System admin has all permissions
      if (req.user.role === 'Admin') {
        return next();
      }

      // Check workspace membership
      const member = workspace.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({ success: false, message: 'You are not a member of this workspace' });
      }

      // Workspace Owner role always has access
      if (member.role === 'Owner') {
        return next();
      }

      if (!roles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          message: `Workspace role ${member.role} is not authorized to access this route`,
        });
      }

      next();
    } catch (error) {
      console.error('Role auth error:', error);
      return res.status(500).json({ success: false, message: 'Server Error in role authorization' });
    }
  };
};

module.exports = { authorize, workspaceAuthorize };
