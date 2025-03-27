import { Request, Response, NextFunction } from "express";

export default class LikeController {
  constructor() {}

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
        const { postId, userId } = req.query;

        // service functions
    } catch (err) {
      next(err);
    }
  }
}
