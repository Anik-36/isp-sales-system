const mongoose = require("mongoose");

let connectionPromise;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(({ connection }) => {
        console.log(`MongoDB connected: ${connection.host}`);
        return connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
