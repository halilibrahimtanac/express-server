import { PrismaClient } from "@prisma/client";
import PostRepository from "../../repositories/PostRepository";
import PostService from "../PostService";

const prismaClient = new PrismaClient();

const postRepository = new PostRepository(prismaClient);

const postService = new PostService(postRepository);

export default postService;