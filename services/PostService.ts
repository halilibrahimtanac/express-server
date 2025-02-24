import { IPostRepository } from "../models/IPostRepository";
import { IPostService } from "../models/IPostService";
import { Post } from "../models/Types";

class PostService implements IPostService {
  constructor(private postRepository: IPostRepository) {}

  async getPosts(username: string): Promise<Post[] | null> {
    return await this.postRepository.getPosts(username);
  }

  async getAllPosts(): Promise<Post[] | null> {
    return await this.postRepository.getAllPosts();
  }

  async getRelatedPosts(postId: number): Promise<Post[] | null> {
    return await this.postRepository.getRelatedPosts(postId);
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
