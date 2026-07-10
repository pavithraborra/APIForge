const Environment = require('../models/Environment');
const Activity = require('../models/Activity');

exports.createEnvironment = async (req, res) => {
  try {
    const { name, workspace, type, variables } = req.body;

    if (!name || !workspace) {
      return res.status(400).json({ success: false, message: 'Name and workspace are required' });
    }

    const environment = await Environment.create({
      name,
      workspace,
      type,
      variables,
      createdBy: req.user._id
    });

    await Activity.create({
      user: req.user._id,
      workspace,
      action: 'created_environment',
      entityType: 'environment',
      entityId: environment._id,
      entityName: environment.name
    });

    res.status(201).json({ success: true, data: environment });
  } catch (error) {
    console.error('Create environment error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating environment' });
  }
};

exports.getEnvironments = async (req, res) => {
  try {
    const environments = await Environment.find({ workspace: req.params.workspaceId });
    res.status(200).json({ success: true, count: environments.length, data: environments });
  } catch (error) {
    console.error('Get environments error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching environments' });
  }
};

exports.getEnvironmentById = async (req, res) => {
  try {
    const environment = await Environment.findById(req.params.id);
    if (!environment) {
      return res.status(404).json({ success: false, message: 'Environment not found' });
    }
    res.status(200).json({ success: true, data: environment });
  } catch (error) {
    console.error('Get environment by ID error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching environment' });
  }
};

exports.updateEnvironment = async (req, res) => {
  try {
    let environment = await Environment.findById(req.params.id);

    if (!environment) {
      return res.status(404).json({ success: false, message: 'Environment not found' });
    }

    environment = await Environment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await Activity.create({
      user: req.user._id,
      workspace: environment.workspace,
      action: 'updated_environment',
      entityType: 'environment',
      entityId: environment._id,
      entityName: environment.name
    });

    res.status(200).json({ success: true, data: environment });
  } catch (error) {
    console.error('Update environment error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating environment' });
  }
};

exports.deleteEnvironment = async (req, res) => {
  try {
    const environment = await Environment.findById(req.params.id);

    if (!environment) {
      return res.status(404).json({ success: false, message: 'Environment not found' });
    }

    await Environment.findByIdAndDelete(req.params.id);

    await Activity.create({
      user: req.user._id,
      workspace: environment.workspace,
      action: 'deleted_environment',
      entityType: 'environment',
      entityId: environment._id,
      entityName: environment.name
    });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete environment error:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting environment' });
  }
};
