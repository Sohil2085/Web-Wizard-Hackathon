import { Router } from "express";
import { registerUser, loginUser, logoutUser, getAllUsers, deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/").get(getAllUsers);
router.route("/:userId").delete(deleteUser);

export default router;