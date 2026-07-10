const express = require('express');
const { 
  createRequest, 
  getRequests, 
  getRequestById, 
  updateRequest, 
  deleteRequest,
  duplicateRequest,
  toggleFavorite,
  executeRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');
const { requestRateLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.use(protect);

router.route('/collection/:collectionId')
  .get(getRequests);

router.route('/')
  .post(createRequest);

router.route('/:id')
  .get(getRequestById)
  .put(updateRequest)
  .delete(deleteRequest);

router.route('/:id/duplicate')
  .post(duplicateRequest);

router.route('/:id/favorite')
  .put(toggleFavorite);

router.route('/:id/execute')
  .post(requestRateLimiter, executeRequest);

module.exports = router;
