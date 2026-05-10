require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const validateEnvironment = () => {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

if (process.env.NODE_ENV !== "production") {
  // ── Local development: normal HTTP server ────────────────────────────────
  (async () => {
    try {
      validateEnvironment();
      await connectDB();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error("Failed to start server:", err.message);
      process.exit(1);
    }
  })();

  module.exports = app;
} else {
  // ── Vercel serverless: lazy DB connection ────────────────────────────────
  // BUG FIX: The previous code called connectDB() without awaiting it before
  // exporting.  On a cold start the first request could arrive before Mongoose
  // connected, returning MongoNotConnectedError on EVERY route.
  //
  // Solution: export a thin async wrapper.  Mongoose caches the connection on
  // the module level so connectDB() is a no-op on warm invocations.

  validateEnvironment();

  let ready = false;

  module.exports = async (req, res) => {
    if (!ready) {
      await connectDB();
      ready = true;
    }
    app(req, res);
  };
}
