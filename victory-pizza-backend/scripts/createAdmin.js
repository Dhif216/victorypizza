// Script to create an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      
      // Update admin with email if missing
      if (!existingAdmin.email) {
        existingAdmin.email = 'admin@victorypizza.com';
        await existingAdmin.save();
        console.log('✅ Updated admin with email address');
      }
      
      console.log('');
      console.log('🔑 Login Credentials:');
      console.log('Email: ' + existingAdmin.email);
      console.log('Username: ' + existingAdmin.username);
      console.log('Password: admin123 (if not changed)');
      console.log('');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@victorypizza.com',
      password: 'admin123', // Change this password after first login!
      role: 'admin',
      name: 'Victory Pizza Admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('Email: admin@victorypizza.com');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️ IMPORTANT: Change this password after your first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
