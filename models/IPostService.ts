import { Post } from "./Types";

export interface IPostService {
    getPosts(username: string): Promise<Post[] | null>;
    createPost(username: string, newPost: Partial<Post>): Promise<Post | null>;
    deletePost(username: string, postId: number): Promise<Post |null>;
}