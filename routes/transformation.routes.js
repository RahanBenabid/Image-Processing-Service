import express from "express";
import { TransformationController } from "./../controllers/index.js";
import { transformationValidation } from "./../middleware/validation.js";

const router = express.Router();

router.post(
  "/:id/transform",
  transformationValidation,
  TransformationController.transformImage,
);

export default router;
