const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Generate deterministic ObjectIds for relationships
const userIds = Array.from({ length: 20 }, () => new mongoose.Types.ObjectId());
const workspaceIds = Array.from({ length: 10 }, () => new mongoose.Types.ObjectId());
const collectionIds = Array.from({ length: 40 }, () => new mongoose.Types.ObjectId());
const requestIds = Array.from({ length: 250 }, () => new mongoose.Types.ObjectId());

const users = [
  { _id: userIds[0], username: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Owner', bio: 'Senior Software Engineer' },
  { _id: userIds[1], username: 'Marcus Rivera', email: 'marcus.rivera@example.com', role: 'Admin', bio: 'Product Manager' },
  { _id: userIds[2], username: 'Aisha Patel', email: 'aisha.patel@example.com', role: 'Developer', bio: 'Backend Developer' },
  { _id: userIds[3], username: 'James OBrien', email: 'james.obrien@example.com', role: 'Developer', bio: 'Frontend Engineer' },
  { _id: userIds[4], username: 'Elena Rossi', email: 'elena.rossi@example.com', role: 'Viewer', bio: 'QA Analyst' },
  { _id: userIds[5], username: 'David Kim', email: 'david.kim@example.com', role: 'Admin', bio: 'Tech Lead' },
  { _id: userIds[6], username: 'Priya Sharma', email: 'priya.sharma@example.com', role: 'Developer', bio: 'Full Stack Engineer' },
  { _id: userIds[7], username: 'Michael Chang', email: 'michael.chang@example.com', role: 'Developer', bio: 'DevOps Engineer' },
  { _id: userIds[8], username: 'Sophie Martin', email: 'sophie.martin@example.com', role: 'Viewer', bio: 'UX Designer' },
  { _id: userIds[9], username: 'Ahmed Hassan', email: 'ahmed.hassan@example.com', role: 'Developer', bio: 'Security Engineer' },
  { _id: userIds[10], username: 'Isabella Silva', email: 'isabella.silva@example.com', role: 'Admin', bio: 'Engineering Manager' },
  { _id: userIds[11], username: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'Developer', bio: 'Mobile Developer' },
  { _id: userIds[12], username: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', role: 'Developer', bio: 'Data Scientist' },
  { _id: userIds[13], username: 'Lucas Santos', email: 'lucas.santos@example.com', role: 'Viewer', bio: 'Technical Writer' },
  { _id: userIds[14], username: 'Emma Wilson', email: 'emma.wilson@example.com', role: 'Developer', bio: 'Cloud Architect' },
  { _id: userIds[15], username: 'Omar Ali', email: 'omar.ali@example.com', role: 'Developer', bio: 'Systems Engineer' },
  { _id: userIds[16], username: 'Mia Wang', email: 'mia.wang@example.com', role: 'Admin', bio: 'Director of Engineering' },
  { _id: userIds[17], username: 'Noah Garcia', email: 'noah.garcia@example.com', role: 'Developer', bio: 'API Developer' },
  { _id: userIds[18], username: 'Ava Miller', email: 'ava.miller@example.com', role: 'Viewer', bio: 'Product Analyst' },
  { _id: userIds[19], username: 'William Brown', email: 'william.brown@example.com', role: 'Developer', bio: 'Site Reliability Engineer' }
];

const workspaces = [
  { _id: workspaceIds[0], name: 'E-Commerce Platform', description: 'Core services for the retail platform', owner: userIds[0] },
  { _id: workspaceIds[1], name: 'Healthcare API', description: 'HIPAA compliant patient data services', owner: userIds[5] },
  { _id: workspaceIds[2], name: 'FinTech Gateway', description: 'Payment processing and ledger services', owner: userIds[10] },
  { _id: workspaceIds[3], name: 'Social Media Backend', description: 'User feeds, connections and messaging', owner: userIds[16] },
  { _id: workspaceIds[4], name: 'IoT Device Manager', description: 'Telemetry and device control APIs', owner: userIds[0] },
  { _id: workspaceIds[5], name: 'Logistics Tracker', description: 'Supply chain visibility and routing', owner: userIds[1] },
  { _id: workspaceIds[6], name: 'HR Management', description: 'Employee lifecycle and payroll integration', owner: userIds[10] },
  { _id: workspaceIds[7], name: 'CRM Integration', description: 'Sales pipeline and customer data syncing', owner: userIds[5] },
  { _id: workspaceIds[8], name: 'Analytics Pipeline', description: 'Data ingestion and reporting endpoints', owner: userIds[16] },
  { _id: workspaceIds[9], name: 'Machine Learning Models', description: 'Inference and training APIs', owner: userIds[0] }
];

const collectionNames = [
  'User Authentication', 'Payment Processing', 'Product Catalog', 'Order Management',
  'Patient Records', 'Appointments', 'Billing', 'Prescriptions',
  'Transactions', 'Accounts', 'Cards', 'Fraud Detection',
  'Posts', 'Comments', 'Friends', 'Messages',
  'Devices', 'Telemetry', 'Firmware Updates', 'Alerts',
  'Shipments', 'Routes', 'Drivers', 'Vehicles',
  'Employees', 'Time Off', 'Payroll', 'Benefits',
  'Leads', 'Contacts', 'Opportunities', 'Campaigns',
  'Events', 'Metrics', 'Dashboards', 'Reports',
  'Inference', 'Training Jobs', 'Datasets', 'Models'
];

const collections = collectionNames.map((name, i) => ({
  _id: collectionIds[i],
  name,
  description: `Endpoints related to ${name.toLowerCase()}`,
  workspace: workspaceIds[Math.floor(i / 4)],
  order: i % 4
}));

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const randomMethod = () => methods[Math.floor(Math.random() * methods.length)];

const apiRequests = requestIds.map((_id, i) => {
  const collectionIndex = i % 40;
  const workspaceIndex = Math.floor(collectionIndex / 4);
  const method = randomMethod();
  const name = `${method} ${collections[collectionIndex].name.split(' ')[0]} ${i % 3 === 0 ? 'List' : i % 3 === 1 ? 'Detail' : 'Action'}`;
  
  return {
    _id,
    name,
    method,
    url: `https://api.example.com/v1/${collections[collectionIndex].name.toLowerCase().replace(' ', '-')}/${i}`,
    collectionId: collectionIds[collectionIndex],
    workspaceId: workspaceIds[workspaceIndex],
    createdBy: userIds[i % 20],
    headers: [{ key: 'Content-Type', value: 'application/json', isActive: true }],
    queryParams: [],
    auth: { type: 'bearer', token: 'dummy_token' },
    body: { type: method === 'GET' || method === 'DELETE' ? 'none' : 'json', content: method === 'GET' || method === 'DELETE' ? '' : '{"example": "data"}' }
  };
});

module.exports = { users, workspaces, collections, apiRequests };
