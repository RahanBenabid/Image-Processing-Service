import express from "express";
import uploadMiddleware from "./upload.js";

export default (app) => {
  // parse incoming JSON requests
  app.use(express.json());
  
  // Middleware to parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Disable the 'X-Powered-By' header to improve security
  app.disable("x-powered-by");

  // Apply multer middleware to specific routes that need file upload
  // Instead of applying globally, attach to specific routes
  app.post("/api/pictures/upload", uploadMiddleware);
  app.put("/api/pictures/:id", uploadMiddleware);
};
