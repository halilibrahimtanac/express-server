import { Post } from "./Types";

export interface IPostRepository {
    getPosts(username: string): Promise<Post[] | null>;
    createPost(username: string, newPost: Partial<Post>): Promise<Post | null>;
}