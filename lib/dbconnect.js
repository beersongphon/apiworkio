const { MongoClient } = require("mongodb");
// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'mydb';


client.connect(url).then(() =>
  console.log('connection successfully!')
).catch((err) =>
  console.error(err)
)

module.exports = client;
