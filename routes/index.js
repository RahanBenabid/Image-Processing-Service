import express from "express";
const router = express.Router();

import pictureRoutes from "./picture.routes.js";
import userRoutes from "./user.routes.js";
import transformationRoutes from "./transformation.routes.js";

router.use("/api/pictures", pictureRoutes);
router.use("/api/users", userRoutes);
router.use("/api/images", transformationRoutes);

export default router;