const { MongoClient } = require("mongodb");
require('dotenv').config();
// Connection URL
const url = process.env.ATLAS_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'mydb';

client.connect(url).then(() =>
  console.log('connection successfully!')
).catch((err) =>
  console.error(err)
)

module.exports = client;
