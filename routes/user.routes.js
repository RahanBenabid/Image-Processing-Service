import express from "express";
import { UserController } from "./../controllers/index.js";
import authenticate from "./../middleware/authenticate.js";

const router = express.Router();

// PROTECTED
router.get("/pictures", authenticate, UserController.listAllImages);
router.get("/", authenticate, UserController.getAllUsers);
router.get("/:id", authenticate, UserController.getUserById);
router.delete("/:id", authenticate, UserController.deleteUserById);

// NON PROTECTED
router.post("/login", UserController.login);
router.post("/register", UserController.register);


export default router;