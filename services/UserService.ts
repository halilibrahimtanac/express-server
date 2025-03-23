import { IUserService, ReturnType } from "../models/IUserService";
import { User } from "../models/Types";
import { IUserRepository } from "../models/IUserRepository";
import JWTService from "./JWTService";
import { IPasswordService } from "../models/IPasswordService";
import { ITokenRepository } from "../models/ITokenRepository";

class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private tokenRepository: ITokenRepository,
    private jwtService: JWTService,
    private passwordService: IPasswordService
  ) {}

  async register(user: User): Promise<ReturnType> {
    // Check if the user already exists
    const existingUser = await this.userRepository.getUserByEmail(user.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash the password (delegated to the PasswordService)
    const hashedPassword = await this.passwordService.hashPassword(
      user.password
    );
    const newUser = { ...user, password: hashedPassword };

    // Save the new user (delegated to the repository)
    const createdUser = await this.userRepository.addUser(newUser);

    // Prepare the user payload for JWT (exclude sensitive information)
    const userPayload: Partial<User> = {
      username: createdUser.username,
      email: createdUser.email,
      userType: createdUser.userType,
      profilePicture: user.profilePicture
    };

    // Generate tokens (delegated to the JWTService)
    const accessToken = this.jwtService.generateAccessToken(userPayload);
    const refreshToken = this.jwtService.generateRefreshToken(userPayload);

    await this.tokenRepository.addUserToken({
      userId: createdUser.id,
      token: refreshToken,
      type: "refresh"
    });

    await this.tokenRepository.addUserToken({
      userId: createdUser.id,
      token: accessToken,
      type: "access"
    });

    return { accessToken, refreshToken, user: userPayload };
  }

  async login(email: string, password: string): Promise<ReturnType> {
    // Retrieve the user by email
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate the password
    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Prepare user payload for tokens
    const userPayload: Partial<User> = {
      username: user.username,
      email: user.email,
      userType: user.userType,
      profilePicture: user.profilePicture
    };

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken(userPayload);
    const refreshToken = this.jwtService.generateRefreshToken(userPayload);

    await this.tokenRepository.addUserToken({
      userId: user.id,
      token: refreshToken,
      type: "refresh"
    });

    await this.tokenRepository.addUserToken({
      userId: user.id,
      token: accessToken,
      type: "access"
    });

    return { accessToken, refreshToken, user: userPayload };
  }

  async logout(rfrshTkn: string, accessTkn: string) {
    try {
      return await this.tokenRepository.removeUserToken(rfrshTkn, accessTkn);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async refresh(rfrshTkn: string) {
    return await this.tokenRepository.refreshToken(rfrshTkn);
  }

  async profile(username: string) {
    try {
      if (!username) {
        throw new Error("Invalid username!");
      }
      const user = await this.userRepository.getUserByUserName(username, [
        "username",
        "name",
        "lastname",
        "birthDate",
        "profilePicture",
        "email",
        "userType",
        "createdAt",
        "id",
      ]);

      return user;
    } catch (err) {
      throw new Error("No user found!");
    }
  }

  async updateUser(updatedUser: Partial<User>){
    return this.userRepository.updateUser(updatedUser);
  }
}

export default UserService;
