import { Request, Response, NextFunction } from "express";
import { IUserService } from "../models/IUserService";

export default class UserController {
  constructor(private userService: IUserService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.body;
      const { accessToken, refreshToken, user: userData } = await this.userService.register(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });

      res.status(201).json({ accessToken, user: userData });
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user: userData } = await this.userService.login(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({ accessToken, user: userData });
    } catch (error: any) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction){
    try{
      const { refreshToken } = req.cookies;
      const accessToken = req.headers.authorization?.split(" ")[1] || "";

      const result = await this.userService.logout(refreshToken, accessToken);
      console.log("Logout Count: ", result);
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logget out successfully"});
    }catch(err: any){
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction){
    try{
      const { refreshToken } = req.cookies;
      const result = await this.userService.refresh(refreshToken);

      res.status(200).json({ accessToken: result });
    }catch(err){
      next(err);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction){
    try{
      const { user } = req;
      const result = await this.userService.profile(user.username);

      res.status(200).json(result);
    }catch(err){
      next(err);
    }
  }
}
