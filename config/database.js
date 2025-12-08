const { MongoClient } = require('mongodb');

let dbConnection;
let client;

module.exports = {
  connectToDatabase: async function(callback) {
    try {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        const err = new Error('MONGODB_URI is not defined in environment variables');
        console.error(err.message);
        return callback(err);
      }

      client = new MongoClient(uri);
      await client.connect();

      const defaultDb = client.db().databaseName || 'after-school-classes';
      dbConnection = client.db(defaultDb);

      console.log('✅ Connected to MongoDB Atlas - DB:', dbConnection.databaseName);
      return callback();
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
      return callback(err);
    }
  },

  getDatabase: function() {
    return dbConnection;
  },

  closeDatabase: function() {
    if (client) {
      client.close();
      console.log('📦 MongoDB connection closed');
    }
  }
};
