import { PrismaClient } from "@prisma/client";
import LikeRepository from "../../repositories/LikeRepository";
import LikeService from "../LikeService";


const prismaClient = new PrismaClient();
const likeRepository = new LikeRepository(prismaClient);
const likeService = new LikeService(likeRepository);

export default likeService;