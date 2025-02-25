import { Post } from "./Types";

export interface IPostRepository {
    getPostsWithFilter<T extends keyof Post>(value?: number, selectedField?: T): Promise<Post[] | Post | null>
    createPost(username: string, newPost: Partial<Post>): Promise<Post | null>;
    deletePost(username: string, postId: number): Promise<Post |null>;
    updatePost(postId: number, updatedPost: Partial<Post>): Promise<Post | null>;
}