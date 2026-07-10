const express = require('express');
const { 
  createWorkspace, 
  getWorkspaces, 
  getWorkspaceById, 
  updateWorkspace, 
  deleteWorkspace,
  inviteMember,
  removeMember,
  updateMemberRole,
  getWorkspaceMembers,
  getWorkspaceAnalytics
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');
const { workspaceAuthorize } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWorkspaces)
  .post(createWorkspace);

router.route('/:id')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getWorkspaceById)
  .put(workspaceAuthorize('Admin'), updateWorkspace)
  .delete(workspaceAuthorize('Admin'), deleteWorkspace);

// Member management
router.route('/:id/members')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getWorkspaceMembers);

router.route('/:id/invite')
  .post(workspaceAuthorize('Admin'), inviteMember);

router.route('/:id/members/:userId')
  .delete(workspaceAuthorize('Admin'), removeMember);

router.route('/:id/members/:userId/role')
  .put(workspaceAuthorize('Admin'), updateMemberRole);

// Analytics
router.route('/:id/analytics')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getWorkspaceAnalytics);

module.exports = router;
