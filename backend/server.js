import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = parseInt(process.env.PORT, 10) || 5000;
let server;

/**
 * Start the server:
 * 1. Connect to DB
 * 2. Start Express
 */
async function start() {
  try {
    await connectDB();
    server = app.listen(PORT, () =>
      console.log(`🚢 Server running on http://localhost:${PORT} (env: ${process.env.NODE_ENV || "development"})`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    // if DB connection fails, exit with failure
    process.exit(1);
  }
}

start();

/**
 * Graceful shutdown helpers
 */
function shutdown(signal) {
  return async () => {
    console.log(`\nReceived ${signal}. Closing server...`);
    try {
      if (server) {
        await new Promise((resolve, reject) => {
          server.close((err) => (err ? reject(err) : resolve()));
        });
      }
      // close DB (mongoose connection) if available
      try {
        // mongoose keeps the connection in the default connection
        // import mongoose lazily to avoid circular deps if not needed earlier
        const mongoose = await import("mongoose");
        await mongoose.connection.close(false); // don't force close in-flight ops
        console.log("MongoDB connection closed.");
      } catch (e) {
        console.warn("Error closing MongoDB connection:", e.message || e);
      }

      console.log("Shutdown complete. Bye 👋");
      process.exit(0);
    } catch (e) {
      console.error("Error during shutdown:", e);
      process.exit(1);
    }
  };
}

process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGTERM"));

// Capture unhandled rejections & uncaught exceptions to avoid silent failures
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  // allow graceful shutdown
  shutdown("unhandledRejection")();
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // allow graceful shutdown
  shutdown("uncaughtException")();
});
