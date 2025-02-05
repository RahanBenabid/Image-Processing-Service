import express from "express";
import { UserController } from "./../controllers/index.js";
import authenticate from "./../middleware/authenticate.js";

const router = express.Router();

// PROTECTED
router.get("/protected", authenticate, UserController.getAllUsers);
router.get("/", authenticate ,UserController.getAllUsers);
router.get("/:id", authenticate, UserController.getUserById);
router.post("/", authenticate, UserController.createUser);
router.delete("/:id", authenticate, UserController.deleteUserById);

// NON PROTECTED
router.post("/login", UserController.login);
router.post("/register", UserController.register);


export default router;