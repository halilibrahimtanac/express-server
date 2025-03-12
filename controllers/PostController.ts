import { Request, Response, NextFunction } from "express";
import { IPostService } from "../models/IPostService";
import FileService from "../services/FileService";
import { idParser, } from "../lib/utils";
import { Post } from "../models/Types";

export default class PostController {
  constructor(private postService: IPostService) {
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const parsedId = idParser(postId);

      const result = await this.postService.getPost(parsedId);

      if (!result) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const routeType = {
        "/get-user-posts": {
          username: user?.username,
        },
        "/get-all-posts": {
          field: "parentPost" as keyof Post,
          value: null
        },
        "/get-related-posts": {
          field: "parentPost" as keyof Post,
          value: req.params.postId ? idParser(req.params.postId) : 0
        }
      }
      const foundFilter = Object.keys(routeType).find(k => req.path.startsWith(k))
      const filter = routeType[foundFilter as keyof typeof routeType];
      let result = await this.postService.getPosts(filter);

      res.status(200).json({ posts: result });
    } catch (err) {
      next(err);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      let { newPost } = req.body;
      const { username } = req.user;
      const file = req.file;

      if(newPost && typeof newPost === "string"){
        newPost = JSON.parse(newPost);
      }
      
      const result = await this.postService.createPost(
        req.user.username,
        newPost
      );

      if (file && result) {
        const filePath = await FileService.saveFile(
          username,
          result.id,
          file
        );

        const mimeType = file.mimetype.startsWith("video/") ? "video" : "image";
        const updatedPost = await this.postService.updatePost(result.id, {
          [mimeType]: filePath,
        });

        res.status(201).json({ updatedPost });
        return;
      }

      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { postId } = req.params;
      const parsedId = idParser(postId);

      const result = await this.postService.deletePost(user.username, parsedId);

      res.status(200).json({ message: "Post successfully deleted.", result });
    } catch (err) {
      next(err);
    }
  }
}
