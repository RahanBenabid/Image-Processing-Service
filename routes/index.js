import express from "express";
const router = express.Router();

import pictureRoutes from "./picture.routes.js";
import userRoutes from "./user.routes.js";

router.use("/api/pictures", pictureRoutes);
router.use("/api/users", userRoutes);

export default router;