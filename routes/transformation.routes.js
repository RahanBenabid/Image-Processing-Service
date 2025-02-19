import express from "express";
import { TransformationController } from "./../controllers/index.js";

const router = express.Router();

router.get("/:id/transform", TransformationController.tranformImage);

export default router;