import express from "express";
import uploadMiddleware from "./upload.js";
import cors from "cors";

export default (app) => {
  // parse incoming JSON requests
  app.use(express.json());

  // Middleware to parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Disable the 'X-Powered-By' header to improve security
  app.disable("x-powered-by");

  // activate cross origins
  const corsOptions = {
    origin: "http://localhost:5173", // Allow only requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allow only these methods
    // allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
  };

  app.use(cors(corsOptions));

  // Apply multer middleware to specific routes that need file upload
  // Instead of applying globally, attach to specific routes
  app.post("/api/pictures/upload", uploadMiddleware);
  app.put("/api/pictures/:id", uploadMiddleware);

  app.post("/api/images/preview", uploadMiddleware);
};
