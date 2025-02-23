import { PrismaClient } from "@prisma/client";
import PostRepository from "../../repositories/PostRepository";
import PostService from "../PostService";
import UserRepository from "../../repositories/UserRepository";

const prismaClient = new PrismaClient();
const userRepository = new UserRepository(prismaClient);
const postRepository = new PostRepository(prismaClient, userRepository);

const postService = new PostService(postRepository);

export default postService;