const express = require('express');
const { 
  createCollection, 
  getCollections, 
  getCollectionById, 
  updateCollection, 
  deleteCollection,
  toggleFavorite,
  togglePin,
  reorderCollections
} = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');
const { workspaceAuthorize } = require('../middleware/roleAuth');

const router = express.Router();

router.use(protect);

router.route('/workspace/:workspaceId')
  .get(workspaceAuthorize('Admin', 'Developer', 'Viewer'), getCollections);

router.route('/')
  .post(createCollection); // Should validate workspaceId in controller body

router.route('/reorder')
  .put(reorderCollections);

router.route('/:id')
  .get(getCollectionById)
  .put(updateCollection)
  .delete(deleteCollection);

router.route('/:id/favorite')
  .put(toggleFavorite);

router.route('/:id/pin')
  .put(togglePin);

module.exports = router;
