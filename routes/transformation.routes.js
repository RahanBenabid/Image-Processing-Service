import express from "express";
import { TransformationController } from "./../controllers/index.js";

const router = express.Router();

router.post("/:id/transform", TransformationController.transformImage);

export default router;
