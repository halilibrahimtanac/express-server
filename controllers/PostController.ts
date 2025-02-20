import { Request, Response, NextFunction } from "express";
import { IPostService } from "../models/IPostService";

export default class PostController {
  constructor(private postService: IPostService) {}

  async getPosts(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    const result = await this.postService.getPosts(user.username);

    res.status(200).json({ posts: result });
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPost } = req.body;
      const result = await this.postService.createPost(
        req.user.username,
        newPost
      );
      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  }
}
