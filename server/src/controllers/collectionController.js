const Collection = require('../models/Collection');
const ApiRequest = require('../models/ApiRequest');
const Activity = require('../models/Activity');

exports.createCollection = async (req, res) => {
  try {
    const { name, description, workspaceId, parentCollection, color } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({ success: false, message: 'Name and workspaceId are required' });
    }

    const existingCount = await Collection.countDocuments({
      workspace: workspaceId,
      parentCollection: parentCollection || null
    });

    const collection = await Collection.create({
      name,
      description,
      workspace: workspaceId,
      parentCollection: parentCollection || null,
      order: existingCount,
      color
    });

    await Activity.create({
      user: req.user._id,
      workspace: workspaceId,
      action: 'created_collection',
      entityType: 'collection',
      entityId: collection._id,
      entityName: collection.name
    });

    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    console.error('Create collection error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating collection' });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ workspace: req.params.workspaceId }).sort({ order: 1, createdAt: 1 });
    
    // For each collection, fetch its requests and attach them to the response
    const collectionsWithRequests = await Promise.all(collections.map(async (col) => {
      const requests = await ApiRequest.find({ collectionId: col._id }).sort({ createdAt: 1 });
      const colObj = col.toObject();
      colObj.requests = requests;
      return colObj;
    }));

    res.status(200).json({ success: true, count: collectionsWithRequests.length, data: collectionsWithRequests });
  } catch (error) {
    console.error('Get collections error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching collections' });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error('Get collection by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching collection' });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    let collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await Activity.create({
      user: req.user._id,
      workspace: collection.workspace,
      action: 'updated_collection',
      entityType: 'collection',
      entityId: collection._id,
      entityName: collection.name
    });

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error('Update collection error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating collection' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    await ApiRequest.deleteMany({ collectionId: collection._id });
    await Collection.findByIdAndDelete(req.params.id);

    await Activity.create({
      user: req.user._id,
      workspace: collection.workspace,
      action: 'deleted_collection',
      entityType: 'collection',
      entityId: collection._id,
      entityName: collection.name
    });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete collection error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting collection' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });

    collection.isFavorite = !collection.isFavorite;
    await collection.save();

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });

    collection.isPinned = !collection.isPinned;
    await collection.save();

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error('Toggle pin error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.reorderCollections = async (req, res) => {
  try {
    const { collections } = req.body;

    if (!Array.isArray(collections)) {
      return res.status(400).json({ success: false, message: 'Collections array is required' });
    }

    for (const item of collections) {
      await Collection.findByIdAndUpdate(item.id, {
        order: item.order,
        parentCollection: item.parentCollection || null
      });
    }

    res.status(200).json({ success: true, message: 'Collections reordered' });
  } catch (error) {
    console.error('Reorder collections error:', error);
    return res.status(500).json({ success: false, message: 'Server error reordering collections' });
  }
};
