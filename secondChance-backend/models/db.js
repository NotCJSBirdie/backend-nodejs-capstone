// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let url = `${process.env.MONGO_URL}`;
let dbInstance = null;
const dbName = `${process.env.MONGO_DB}`;

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance;
    };

    const client = new MongoClient(url);

    // Task 2: Connect to MongoDB
    await client.connect();

    // Task 3: Connect to correct database and assign to dbInstance
    dbInstance = client.db(dbName);

    // Task 4: Return the database instance
    return dbInstance;
}

module.exports = connectToDatabase;
