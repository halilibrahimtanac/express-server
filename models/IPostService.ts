import { Post } from "./Types";

export interface IPostService {
    getPost(postId: number): Promise<Post | null>;
    getPosts(username?: string): Promise<Post[] | null>;
    getRelatedPosts(postId: number): Promise<Post[] | null>;
    createPost(username: string, newPost: Partial<Post>): Promise<Post | null>;
    deletePost(username: string, postId: number): Promise<Post | null>;
    updatePost(postId: number, updatedPost: Partial<Post>): Promise<Post | null>;
}