import mongoose from 'mongoose';
const { MongoClient } = mongoose.mongo;
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function testConnection() {
    if (!uri) {
        console.error("MONGODB_URI is not defined");
        process.exit(1);
    }

    console.log(`Connecting to: ${uri.split('@')[1]}...`);
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

    try {
        await client.connect();
        console.log("✅ Successfully connected to MongoDB via Native Driver!");
        const dbs = await client.db().admin().listDatabases();
        console.log("Found databases:", dbs.databases.map(db => db.name).join(', '));
    } catch (err: any) {
        console.error("❌ Native Driver Connection Failed!");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.message.includes('IP')) {
            console.error("👉 This looks like an IP Whitelist issue!");
        }
    } finally {
        await client.close();
    }
}

testConnection();
