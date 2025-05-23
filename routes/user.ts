import { Router } from "express";
import UserController from "../controllers/UserController";
import userService from "../services/instances/userServiceInstance";
import authorize from "../middlewares/authMiddleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Create a controller instance with the injected userService
const userController = new UserController(userService);

// Map routes to controller methods
router.post("/register", (req, res, next) => userController.register(req, res, next));
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.get("/logout", authorize, (req, res, next) => userController.logout(req, res, next));
router.get("/refresh", (req, res, next) => userController.refresh(req, res, next));
router.get("/profile", authorize, (req, res, next) => userController.profile(req, res, next));
router.get("/profile/:username", authorize, (req, res, next) => userController.profile(req, res, next));
router.post("/profile-update", authorize, upload.single('file'), (req, res, next) => userController.updateProfile(req, res, next));

export default router;
