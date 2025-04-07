const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
//if it's not cached, then connect to the database
async function connectToDatabase(retries = 3, delay = 2000) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      for (let i = 0; i < retries; i++) {
        try {
          const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          cached.conn = conn;
          return conn;
        } catch (error) {
          console.warn(`MongoDB connection failed (attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`);
          if (i < retries - 1) {
            await new Promise(res => setTimeout(res, delay));
          } else {
            throw new Error("MongoDB connection failed after multiple attempts.");
          }
        }
      }
    })();
  }

  return cached.promise;
}

module.exports = connectToDatabase;
