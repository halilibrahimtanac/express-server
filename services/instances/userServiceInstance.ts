import { PrismaClient } from "@prisma/client";
import UserRepository from "../../repositories/UserRepository";
import JWTService from "../JWTService";
import UserService from "../UserService";
import PasswordService from "../PasswordService";
import TokenRepository from "../../repositories/TokenRepository";


// Instantiate PrismaClient
const prismaClient = new PrismaClient();
// Get the singleton instance of JWTService
const jwtService = JWTService.getInstance();

// Set up the repository using PrismaClient
const userRepository = new UserRepository(prismaClient);
const tokenRepository = new TokenRepository(prismaClient, jwtService);

// Create the UserService with its dependencies injected
const userService = new UserService(userRepository, tokenRepository, jwtService, PasswordService);

export default userService;
