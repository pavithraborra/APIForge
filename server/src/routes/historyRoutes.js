const express = require('express');
const { 
  getHistory, 
  getHistoryById, 
  deleteHistory, 
  clearHistory
} = require('../controllers/historyController');
const { protect } = require('../middleware/auth');
const { workspaceAuthorize } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

router.route('/workspace/:workspaceId')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getHistory)
  .delete(workspaceAuthorize('Admin', 'Developer'), clearHistory);

router.route('/:id')
  .get(getHistoryById)
  .delete(deleteHistory);

module.exports = router;
