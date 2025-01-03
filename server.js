import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import routes from "./routes/index.js";

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cookieParser());

// Routes
app.use("/", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route doesn't exist" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

// Start server
app.listen(PORT, () => {
  console.log(`App is running and listening on port ${PORT}`);
})