import express from "express";
const router = express.Router();

import pictureRoutes from "./picture.routes.js";

router.use("/api/pictures", pictureRoutes)

export default router;