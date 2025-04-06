import { Router } from "express";
import authorize from "../middlewares/authMiddleware";
import LikeController from "../controllers/LikeController";
import likeService from "../services/instances/likeServiceInstance";

const router = Router();

const likeController = new LikeController(likeService);

router.post("/post-like/:postId", authorize, (req, res, next) => likeController.likePost(req, res, next));

export default router