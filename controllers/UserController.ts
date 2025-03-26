import { Request, Response, NextFunction } from "express";
import { IUserService } from "../models/IUserService";
import FileService from "../services/FileService";
import { User } from "../models/Types";

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

      res.status(200).json(result);
    }catch(err){
      next(err);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction){
    try{
      const { user } = req;
      const { username } = req.params;
      const result = await this.userService.profile(username || user.username);

      res.status(200).json(result);
    }catch(err){
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction){
    try{
      const { user } = req;
      const file = req.file;
      
      let updatedFields: Partial<User> = {};
      let userKeys: (keyof User)[] = ["email", "name", "lastname", "birthDate"];
      
      userKeys.forEach((ky) => {
        if(req.body[ky]){
          updatedFields[ky] = ky === "birthDate" ? new Date(req.body[ky]) : req.body[ky]
        }
      });

      updatedFields.username = user.username;

      if(file){
        const filePath = await FileService.saveFile(user.username, "profilePicture", file);
        updatedFields.profilePicture = filePath;
      }

      await this.userService.updateUser(updatedFields);

      res.status(201).json({ message: "Success" });
    }catch(err){
      next(err);
    }
  }
}
