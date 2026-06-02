import { initDatabase } from './src/database/db.js';
import { User } from './src/models/index.js';

async function setupUsers() {
  try {
    await initDatabase();
    
    // Admin
    let admin = await User.findByEmail('admin@namsor.local');
    if (!admin) {
      admin = await User.create({
        email: 'admin@namsor.local',
        password: 'admin123',
        fullName: 'Administrator',
        role: 'admin',
        department: 'Management'
      });
      console.log('✓ Admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }
    
    // Accountant
    let accountant = await User.findByEmail('accountant@namsor.local');
    if (!accountant) {
      accountant = await User.create({
        email: 'accountant@namsor.local',
        password: 'accountant123',
        fullName: 'Accountant',
        role: 'accountant',
        department: 'Finance'
      });
      console.log('✓ Accountant user created');
    }
    
    // Viewer
    let viewer = await User.findByEmail('viewer@namsor.local');
    if (!viewer) {
      viewer = await User.create({
        email: 'viewer@namsor.local',
        password: 'viewer123',
        fullName: 'Report Viewer',
        role: 'viewer',
        department: 'Reports'
      });
      console.log('✓ Viewer user created');
    }
    
    console.log('\n✅ All users ready!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setupUsers();
