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

// Support both Render (MONGODB_URI) and local dev (MONGO_URI)
const MONGO_CONNECTION = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_CONNECTION) {
  console.error('\u274C No MongoDB URI found. Set MONGODB_URI or MONGO_URI in your .env file.');
  process.exit(1);
}

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION);
    const dbName = mongoose.connection.db.databaseName;
    console.log(`\u2705 MongoDB Connected: ${mongoose.connection.host} / ${dbName}`);

    // ─── SAFE CLEANUP: only remove previously seeded demo accounts ───────────
    // We identify seeded users by their email addresses so real user accounts
    // that were created in production are NEVER touched.
    const seededEmails = users.map(u => u.email);
    const existingSeededUsers = await User.find({ email: { $in: seededEmails } });
    const seededUserIds = existingSeededUsers.map(u => u._id);

    if (seededUserIds.length > 0) {
      // Remove workspaces owned by seeded users
      const seededWorkspaces = await Workspace.find({ owner: { $in: seededUserIds } });
      const seededWorkspaceIds = seededWorkspaces.map(w => w._id);

      if (seededWorkspaceIds.length > 0) {
        await Collection.deleteMany({ workspace: { $in: seededWorkspaceIds } });
        await ApiRequest.deleteMany({ workspaceId: { $in: seededWorkspaceIds } });
        await Environment.deleteMany({ workspace: { $in: seededWorkspaceIds } });
        await Activity.deleteMany({ workspace: { $in: seededWorkspaceIds } });
        await Workspace.deleteMany({ _id: { $in: seededWorkspaceIds } });
      }
      await User.deleteMany({ email: { $in: seededEmails } });
      console.log('\uD83D\uDDD1\uFE0F  Removed existing demo/seeded data (real production data preserved)');
    } else {
      console.log('\u2139\uFE0F  No previous seed data found — fresh seed');
    }

    // ─── INSERT USERS ─────────────────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const usersToInsert = users.map(user => ({
      ...user,
      password: hashedPassword
    }));
    await User.insertMany(usersToInsert);
    console.log(`\u2705 Inserted ${users.length} demo users`);

    // ─── INSERT WORKSPACES ────────────────────────────────────────────────────
    const workspacesToInsert = workspaces.map(ws => {
      const members = [{ user: ws.owner, role: 'Owner' }];
      const numMembers = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < numMembers; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]._id;
        if (!members.find(m => m.user.toString() === randomUser.toString())) {
          const roles = ['Admin', 'Developer', 'Viewer'];
          members.push({ user: randomUser, role: roles[Math.floor(Math.random() * roles.length)] });
        }
      }
      return { ...ws, members };
    });
    await Workspace.insertMany(workspacesToInsert);
    console.log(`\u2705 Inserted ${workspaces.length} workspaces`);

    // ─── INSERT COLLECTIONS ───────────────────────────────────────────────────
    await Collection.insertMany(collections);
    console.log(`\u2705 Inserted ${collections.length} collections`);

    // ─── INSERT REQUESTS ──────────────────────────────────────────────────────
    await ApiRequest.insertMany(apiRequests);
    console.log(`\u2705 Inserted ${apiRequests.length} API requests`);

    // ─── INSERT ENVIRONMENTS ──────────────────────────────────────────────────
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
    console.log(`\u2705 Inserted ${envs.length} environments`);

    // ─── INSERT ACTIVITY LOGS ─────────────────────────────────────────────────
    const activities = [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    apiRequests.forEach(req => {
      const date = new Date(
        sixMonthsAgo.getTime() + Math.random() * (Date.now() - sixMonthsAgo.getTime())
      );
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
    console.log(`\u2705 Inserted ${activities.length} activity logs`);

    console.log('\n\uD83C\uDF89 Seeding complete!');
    console.log('   Login: sarah.chen@example.com / password123  (Owner role)');
    process.exit(0);
  } catch (error) {
    console.error('\u274C Seed error:', error.message || error);
    process.exit(1);
  }
};

seedDB();
