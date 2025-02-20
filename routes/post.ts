import { Router } from "express";
import authorize from "../middlewares/authMiddleware";
import postService from "../services/instances/postServiceInstance";
import PostController from "../controllers/PostController";

const router = Router();

const postController = new PostController(postService);

router.get("/get-posts", authorize, (req, res, next) => postController.getPosts(req, res, next));
router.post("/new-post", authorize, (req, res, next) => postController.createPost(req, res, next));

export default router;