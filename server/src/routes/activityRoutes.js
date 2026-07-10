const express = require('express');
const { 
  getActivities, 
  getRecentActivities 
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const { workspaceAuthorize } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

router.route('/recent')
  .get(getRecentActivities);

router.route('/workspace/:workspaceId')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getActivities);

module.exports = router;
