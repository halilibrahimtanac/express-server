import { IPostRepository } from "../models/IPostRepository";
import { IPostService } from "../models/IPostService";
import { Post } from "../models/Types";

class PostService implements IPostService {
  constructor(private postRepository: IPostRepository) {}

  async getPosts(username: string): Promise<Post[] | null> {
    return await this.postRepository.getPosts(username);
  }

  async createPost(
    username: string,
    newPost: Partial<Post>
  ): Promise<Post | null> {
    return await this.postRepository.createPost(username, newPost);
  }
}

export default PostService;
