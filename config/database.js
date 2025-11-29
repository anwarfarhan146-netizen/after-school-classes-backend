const { MongoClient } = require('mongodb');

let dbConnection;
let client;

module.exports = {
  connectToDatabase: function(callback) {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('MONGODB_URI is not defined in environment variables');
      return callback(new Error('Database connection string not found'));
    }

    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    client.connect()
      .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        dbConnection = client.db('after-school-classes');
        return callback();
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        return callback(err);
      });
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