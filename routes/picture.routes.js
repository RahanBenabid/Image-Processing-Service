import express from "express";
import { PictureController } from "./../controllers/index.js";
import authenticate from "./../middleware/authenticate.js";
import limiter from "./../middleware/rate.limit.js";

const router = express.Router();

// PROTECTED
router.get("/", authenticate, limiter, PictureController.getAllPictures);
router.get("/:id", authenticate, limiter, PictureController.getPictureById);
// router.post("/", authenticate, limiter, PictureController.createPictureRequest);
router.post("/upload", authenticate, PictureController.uploadPicture);
router.delete("/:id", authenticate, PictureController.deletePictureById);

export default router;