import express from "express";
import { UserController } from "./../controllers/index.js";
import authenticate from "./../middleware/authenticate.js";

const router = express.Router();

// PROTECTED
router.get("/protected", authenticate, UserController.getAllUsers);

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.delete("/:id", UserController.deleteUserById);


export default router;