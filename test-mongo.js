// Test MongoDB connection
const { MongoClient } = require('mongodb');
const dns = require('dns');

// Set DNS resolution order to prefer IPv4 (helps with MongoDB SRV on Node.js v24)
dns.setDefaultResultOrder?.("ipv4first");

// Back to using SRV connection string
const uri = 'mongodb+srv://Vercel-Admin-mansel-db:H1tJcqskRLkxdYZO@mansel-db.5l3ydxy.mongodb.net/?retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
});

async function testConnection() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✓ Connected successfully!');

    const db = client.db('sea-witch');
    console.log('✓ Database accessed:', db.databaseName);

    // Try to list collections
    const collections = await db.listCollections().toArray();
    console.log('✓ Collections:', collections.map(c => c.name).join(', ') || '(none yet)');

  } catch (error) {
    console.error('✗ Connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

testConnection();
