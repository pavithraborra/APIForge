require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Collection = require('../models/Collection');
const ApiRequest = require('../models/ApiRequest');
const Activity = require('../models/Activity');
const Environment = require('../models/Environment');
const { users, workspaces, collections, apiRequests } = require('./seedData');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Workspace.deleteMany();
    await Collection.deleteMany();
    await ApiRequest.deleteMany();
    await Activity.deleteMany();
    await Environment.deleteMany();
    console.log('Existing data cleared');

    // Insert Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const usersToInsert = users.map(user => ({
      ...user,
      password: hashedPassword
    }));
    await User.insertMany(usersToInsert);
    console.log(`Inserted ${users.length} users`);

    // Insert Workspaces
    const workspacesToInsert = workspaces.map(ws => {
      // Add random members to workspace
      const members = [{ user: ws.owner, role: 'Owner' }];
      const numMembers = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < numMembers; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]._id;
        if (!members.find(m => m.user === randomUser)) {
          const roles = ['Admin', 'Developer', 'Viewer'];
          members.push({ user: randomUser, role: roles[Math.floor(Math.random() * roles.length)] });
        }
      }
      return { ...ws, members };
    });
    await Workspace.insertMany(workspacesToInsert);
    console.log(`Inserted ${workspaces.length} workspaces`);

    // Insert Collections
    await Collection.insertMany(collections);
    console.log(`Inserted ${collections.length} collections`);

    // Insert Requests
    await ApiRequest.insertMany(apiRequests);
    console.log(`Inserted ${apiRequests.length} requests`);

    // Insert Environments
    const envs = workspaces.map(ws => ({
      name: 'Production',
      workspace: ws._id,
      type: 'production',
      variables: [
        { key: 'API_URL', value: 'https://api.example.com', isActive: true },
        { key: 'API_KEY', value: 'prod_key_xyz', isActive: true }
      ],
      createdBy: ws.owner
    }));
    await Environment.insertMany(envs);
    console.log(`Inserted ${envs.length} environments`);

    // Insert Activities (randomized over last 6 months)
    const activities = [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    apiRequests.forEach(req => {
      const date = new Date(sixMonthsAgo.getTime() + Math.random() * (new Date().getTime() - sixMonthsAgo.getTime()));
      activities.push({
        user: req.createdBy,
        workspace: req.workspaceId,
        action: 'created_request',
        entityType: 'request',
        entityId: req._id,
        entityName: req.name,
        createdAt: date,
        updatedAt: date
      });
    });
    await Activity.insertMany(activities);
    console.log(`Inserted ${activities.length} activity logs`);

    console.log('Seeding Complete! Use email: sarah.chen@example.com / password: password123 to login as Owner.');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
