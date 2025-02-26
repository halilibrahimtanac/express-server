import { PrismaClient } from "@prisma/client";
import BaseRepository from "./BaseRepository";
import { IPostRepository } from "../models/IPostRepository";
import { Post } from "../models/Types";
import { IUserRepository } from "../models/IUserRepository";

class PostRepository extends BaseRepository implements IPostRepository {
  constructor(dbClient: PrismaClient, private userRepository: IUserRepository) {
    super(dbClient);
  }

  async getPostsWithFilter<T extends keyof Post>(value?: number | null, selectedField?: T): Promise<Post[] | Post | null> {
    const posts = await this.dbClient.post.findMany({
      where: { ...selectedField ? { [selectedField]: value } : {} },
    });

    return posts.length === 1 ? posts[0] : posts;
  }

  async createPost(
    username: string,
    newPost: Partial<Post>
  ): Promise<Post | null> {
    const user = await this.userRepository.getUserByUserName(username, ["id"]);

    if (!user || !user.id) {
      return null;
    }

    // Extract unnecessary fields like createdAt and updatedAt
    const { createdAt, updatedAt, id, ...postData } = newPost;

    const createdPost = await this.dbClient.post.create({
      data: {
        ...postData,
        createdBy: user.id,
      },
    });

    return createdPost;
  }

  async updatePost(
    postId: number,
    updatedPost: Partial<Post>
  ): Promise<Post | null> {

    const result = await this.dbClient.post.update({
      where: { id: postId },
      data: {
        body: updatedPost.body,
        image: updatedPost.image,
        video: updatedPost.video,
      },
    });

    return result;
  }

  async deletePost(username: string, postId: number): Promise<Post | null> {
    const user = await this.userRepository.getUserByUserName(username, ["id"]);

    if (!user) {
      return null;
    }

    const result = await this.dbClient.post.delete({
      where: { id: postId, createdBy: user.id },
    });

    return result;
  }
}

export default PostRepository;
