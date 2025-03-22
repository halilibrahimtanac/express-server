import { Router } from "express";
import authorize from "../middlewares/authMiddleware";
import postService from "../services/instances/postServiceInstance";
import PostController from "../controllers/PostController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

const postController = new PostController(postService);

router.get("/get-post/:postId", authorize, (req, res, next) => postController.getPost(req, res, next));
router.get("/get-user-posts", authorize, (req, res, next) => postController.getPosts(req, res, next));
router.get("/get-user-posts/:username", authorize, (req, res, next) => postController.getPosts(req, res, next));
router.get("/get-all-posts", authorize, (req, res, next) => postController.getPosts(req, res, next));
router.get("/get-related-posts/:postId", authorize, (req, res, next) => postController.getPosts(req, res, next));
router.post("/new-post", authorize, upload.single('file'), (req, res, next) => postController.createPost(req, res, next));
router.delete("/delete-post/:postId", authorize, (req, res, next) => postController.deletePost(req, res, next))

export default router;