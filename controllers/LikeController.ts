import { Request, Response, NextFunction } from "express";
import { ILikeService } from "../models/ILikeService";
import { idParser } from "../lib/utils";

export default class LikeController {
  constructor(private likeService: ILikeService) {}

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
        const { postId } = req.params;
        const parsedId = idParser(postId);
        const { user } = req.user;

        const result = await this.likeService.likePost(user.username, parsedId);
        
        res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
