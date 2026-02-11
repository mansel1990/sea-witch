// Test Mongoose connection
const mongoose = require('mongoose');

// Using correct credentials from Compass
const uri = 'mongodb+srv://Vercel-Admin-mansel-db:mansel59@mansel-db.5l3ydxy.mongodb.net/sea-witch?retryWrites=true&w=majority';

console.log('Testing Mongoose connection...');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password

async function testConnection() {
  try {
    console.log('Connecting with Mongoose...');
    await mongoose.connect(uri, {
      bufferCommands: false,
      dbName: 'sea-witch',
    });

    console.log('✓ Connected successfully!');
    console.log('✓ Database:', mongoose.connection.db.databaseName);

    // Try to list collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✓ Collections:', collections.map(c => c.name).join(', ') || '(none yet)');

    // Test that we can get the native client for Better Auth
    const client = mongoose.connection.getClient();
    console.log('✓ Native MongoDB client available:', !!client);

  } catch (error) {
    console.error('✗ Connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Connection closed.');
  }
}

testConnection();
