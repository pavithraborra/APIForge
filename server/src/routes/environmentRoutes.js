const express = require('express');
const { 
  createEnvironment, 
  getEnvironments, 
  getEnvironmentById, 
  updateEnvironment, 
  deleteEnvironment
} = require('../controllers/environmentController');
const { protect } = require('../middleware/auth');
const { workspaceAuthorize } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

router.route('/workspace/:workspaceId')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getEnvironments);

router.route('/')
  .post(createEnvironment);

router.route('/:id')
  .get(getEnvironmentById)
  .put(updateEnvironment)
  .delete(deleteEnvironment);

module.exports = router;
