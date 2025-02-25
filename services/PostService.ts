import { IPostRepository } from "../models/IPostRepository";
import { IPostService } from "../models/IPostService";
import { IUserRepository } from "../models/IUserRepository";
import { Post } from "../models/Types";

class PostService implements IPostService {
  constructor(private postRepository: IPostRepository, private userRepository: IUserRepository) {}

  async getPost(postId: number): Promise<Post | null> {
    return await this.postRepository.getPostsWithFilter(postId, "id") as (Post | null);
  }

  async getPosts(username?: string): Promise<Post[] | null> {
    let posts;
    if(username){
      const user = await this.userRepository.getUserByUserName(username, ["id"]);
      if (!user) {
        return null;
      }
      posts = await this.postRepository.getPostsWithFilter(user.id as number, "createdBy") as (Post[] | null);
    } else {
      posts = await this.postRepository.getPostsWithFilter() as (Post[] | null);
    }
    
    return posts as (Post[] | null);
  }

  async getRelatedPosts(postId: number): Promise<Post[] | null> {
    return await this.postRepository.getPostsWithFilter(postId, "parentPost") as (Post[] | null);
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
