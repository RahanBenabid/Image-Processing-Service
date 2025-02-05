import express from "express";
import { PictureController } from "./../controllers/index.js";
import authenticate from "./../middleware/authenticate.js";

const router = express.Router();

// PROTECTED
router.get("/", authenticate, PictureController.getAllPictures);
router.get("/:id", authenticate, PictureController.getPictureById);
router.post("/", authenticate, PictureController.createPictureRequest);
router.delete("/:id", authenticate, PictureController.deletePictureById);

export default router;