import { IPostRepository } from "../models/IPostRepository";
import { IPostService } from "../models/IPostService";
import { IUserRepository } from "../models/IUserRepository";
import { GetPostsOptions, Post } from "../models/Types";

class PostService implements IPostService {
  constructor(private postRepository: IPostRepository, private userRepository: IUserRepository) {}

  async getPost(postId: number): Promise<Post | null> {
    return await this.postRepository.getPostsWithFilter(postId, "id") as (Post | null);
  }

  async getPosts(options: GetPostsOptions = {}): Promise<Post[] | null> {
    let posts;
    if (options.username) {
      // Handle username by fetching user ID and filtering by createdBy
      const user = await this.userRepository.getUserByUserName(options.username, ["id"]);
      if (!user) {
        return null;
      }
      posts = await this.postRepository.getPostsWithFilter(user.id as number, "createdBy") as (Post[] | null);
    } else {
      // Ensure value is provided when field is specified
      if (options.value === undefined) {
        throw new Error("Value must be provided when field is specified");
      }
      // Filter by the specified field and value
      posts = await this.postRepository.getPostsWithFilter(options.value, options.field) as (Post[] | null);
    }

    return posts;
  }

  async createPost(
    username: string,
    newPost: Partial<Post>
  ): Promise<Post | null> {
    return await this.postRepository.createPost(username, newPost);
  }

  async updatePost(
    postId: number,
    updatedPost: Partial<Post>
  ): Promise<Post | null> {
    return await this.postRepository.updatePost(postId, updatedPost);
  }

  async deletePost(username: string, postId: number): Promise<Post | null> {
    return await this.postRepository.deletePost(username, postId);
  }
}

export default PostService;
