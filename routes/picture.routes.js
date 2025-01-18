import express from "express";
import { PictureController } from "./../controllers/index.js";

const router = express.Router();

router.get("/", PictureController.getAllPictures);
router.get("/:id", PictureController.getPictureById);
router.post("/", PictureController.createPictureRequest);
router.delete("/:id", PictureController.deletePictureById);

export default router;