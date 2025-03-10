import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";
import config from "./config/dotenv.js";
import middlewares from "./middleware/index.js";

const app = express();
const PORT = config.port;

// Connect to MongoDB
connectDB();

// Apply middleware
middlewares(app);

// Routes
app.use("/", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route doesn't exist" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle MongoDB/Mongoose errors
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid data provided", 
      error: err.message 
    });
  }
  
  // Default 500 error
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is live @ ${config.hostUrl}`);
});
