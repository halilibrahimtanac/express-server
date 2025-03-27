import { Router } from "express";
import authorize from "../middlewares/authMiddleware";
import LikeController from "../controllers/LikeController";

const router = Router();

const likeController = new LikeController();

router.get("/post-like", authorize, (req, res, next) => likeController.likePost(req, res, next));

export default router