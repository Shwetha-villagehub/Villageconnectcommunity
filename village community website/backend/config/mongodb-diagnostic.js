import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 MongoDB Connection Diagnostic Tool\n');
console.log('='.repeat(60));

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env file');
  process.exit(1);
}

// Parse and display URI info
try {
  const url = new URL(MONGODB_URI);

  console.log('\n✅ Connection String Format: Valid');
  console.log(`   Protocol: ${url.protocol}`);
  console.log(`   Username: ${url.username || 'Not provided'}`);
  console.log(`   Password: ${'*'.repeat(Math.max(url.password?.length || 0, 1))}`);
  console.log(`   Hosts: ${url.hosts || 'mongodb+srv'}`);
  console.log(`   Database: ${url.pathname?.slice(1) || 'admin'}`);
  console.log(
    `   Auth Source: ${url.searchParams.get('authSource') || 'admin'}`
  );
  console.log(`   Replica Set: ${url.searchParams.get('replicaSet') || 'N/A'}`);
  console.log(
    `   SSL: ${url.searchParams.get('ssl') === 'true' ? 'Enabled' : 'Disabled'}`
  );
} catch (err) {
  console.error('❌ Error parsing connection string:', err.message);
}

console.log('\n' + '='.repeat(60));
console.log('🔌 Attempting Connection...\n');

const startDiagnostic = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ SUCCESS! Connected to MongoDB Atlas\n');
    console.log('Connection Details:');
    console.log(`   - Host: ${conn.connection.host}`);
    console.log(`   - Database: ${conn.connection.name}`);
    console.log(`   - Port: ${conn.connection.port}`);
    console.log(`   - Ready State: ${conn.connection.readyState}`);

    // Run a simple ping to verify
    const admin = conn.connection.db.admin();
    const ping = await admin.ping();

    console.log('\n✅ Ping Response:', ping);
    console.log('\n✅ MongoDB Atlas connection is working perfectly!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed!\n');

    if (error.message.includes('authentication failed')) {
      console.error('Issue: Authentication Failed');
      console.log(`
Possible causes:
  1. Invalid username or password
  2. Username/password not URL-encoded
  3. User does not have access to this cluster
  4. Database/authSource mismatch
  
💡 Tips:
  - Special characters in passwords must be URL-encoded
  - Example: ! = %21, % = %25, @ = %40, : = %3A
  - Use MongoDB Atlas connection string directly from the dashboard
  - Verify user exists in Database Access section
      `);
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('Issue: Cannot reach MongoDB servers (DNS resolution failed)');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.error('Issue: Connection timeout - Network may be blocked');
    } else {
      console.error(`Issue: ${error.message}`);
    }

    console.log('\n📋 Full Error Details:');
    console.error(error);

    process.exit(1);
  }
};

startDiagnostic();
