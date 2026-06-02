/**
 * Production Setup Script
 * Runs on first deployment to initialize database and create admin user
 */

import { initDatabase } from './database/db.js';
import { User } from './models/index.js';
import { hashPassword } from './utils/helpers.js';

async function setupProduction() {
  try {
    console.log('🔧 Starting production setup...');

    // Initialize database and create tables
    console.log('📦 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized');

    // Check if admin user exists
    const adminExists = await User.findByEmail('admin@namsor.local');
    
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      await User.create({
        email: 'admin@namsor.local',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        fullName: 'Administrator',
        role: 'admin'
      });
      console.log('✅ Admin user created');
      console.log('   Email: admin@namsor.local');
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create accountant user if doesn't exist
    const accountantExists = await User.findByEmail('accountant@namsor.local');
    if (!accountantExists) {
      await User.create({
        email: 'accountant@namsor.local',
        password: process.env.ACCOUNTANT_PASSWORD || 'accountant123',
        fullName: 'Accountant',
        role: 'accountant'
      });
      console.log('✅ Accountant user created');
    }

    // Create viewer user if doesn't exist
    const viewerExists = await User.findByEmail('viewer@namsor.local');
    if (!viewerExists) {
      await User.create({
        email: 'viewer@namsor.local',
        password: process.env.VIEWER_PASSWORD || 'viewer123',
        fullName: 'Viewer',
        role: 'viewer'
      });
      console.log('✅ Viewer user created');
    }

    console.log('');
    console.log('✨ Production setup complete!');
    console.log('');
    console.log('📝 Demo Credentials:');
    console.log('   Admin:      admin@namsor.local / admin123');
    console.log('   Accountant: accountant@namsor.local / accountant123');
    console.log('   Viewer:     viewer@namsor.local / viewer123');
    console.log('');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    // Don't exit - let server continue in case it's a non-critical error
  }
}

// Run setup
setupProduction();
