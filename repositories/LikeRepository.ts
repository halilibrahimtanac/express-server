import { PrismaClient } from "@prisma/client";
import { ILikeRepository } from "../models/ILikeRepository";
import BaseRepository from "./BaseRepository";

class LikeRepository extends BaseRepository implements ILikeRepository {
    constructor(dbClient: PrismaClient) {
        super(dbClient);
    }

    async likePost(username: string, postId: number): Promise<{ success: boolean; message: string; }> {
        const user = await this.dbClient.user.findUnique({ where: { username }, select: { id: true }});

        if(!user){
            return { success: false, message: "user not found"}
        }

        const existingLike = await this.dbClient.like.findUnique({
          where: {
            userId_postId: {
              userId: user.id,
              postId: postId,
            },
          },
        });

        if (existingLike) {
            // --- UNLIKE ---
            await this.dbClient.like.delete({
              where: {
                 userId_postId: {
                  userId: user.id,
                  postId: postId,
                }
              },
            });
            console.log(`User ${username} (ID: ${user.id}) unliked post ${postId}`);
            return { success: true, message: 'Post unliked successfully.' };
      
          } else {
            // --- LIKE ---
            await this.dbClient.like.create({
              data: {
                userId: user.id,
                postId: postId,
              },
            });
            console.log(`User ${username} (ID: ${user.id}) liked post ${postId}`);
            return { success: true, message: 'Post liked successfully.' };
          }
    }
}

export default LikeRepository;