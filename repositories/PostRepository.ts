import { PrismaClient } from "@prisma/client";
import BaseRepository from "./BaseRepository";
import { IPostRepository } from "../models/IPostRepository";
import { Post, User } from "../models/Types";

class PostRepository extends BaseRepository implements IPostRepository {
  constructor(dbClient: PrismaClient) {
    super(dbClient);
  }

  async getUserByUserName<T extends keyof User>(
    username: string,
    selectFields: T[]
  ): Promise<Pick<User, T> | null> {
    // Convert the array of fields into a Prisma "select" object
    const select = selectFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<T, boolean>);

    // Fetch the user with the selected fields
    const user = await this.dbClient.user.findUnique({
      where: { username },
      select,
    });

    // Cast the result to `Pick<User, T> | null` to satisfy TypeScript
    return user as Pick<User, T> | null;
  }

  async getPosts(username: string): Promise<Post[] | null> {
    const user = await this.getUserByUserName(username, ["id"]);

    if (!user) {
      return null;
    }

    const posts = await this.dbClient.post.findMany({
      where: { createdBy: user.id },
    });

    return posts;
  }

  async createPost(
    username: string,
    newPost: Partial<Post>
  ): Promise<Post | null> {
      const user = await this.getUserByUserName(username, ["id"]);

      if (!user) {
        return null;
      }

      // Extract unnecessary fields like createdAt and updatedAt
      const { createdAt, updatedAt, ...postData } = newPost;

      const createdPost = await this.dbClient.post.create({
        data: {
          ...postData,
          createdBy: user.id,
        },
      });

      return createdPost;
  }
}

export default PostRepository;
