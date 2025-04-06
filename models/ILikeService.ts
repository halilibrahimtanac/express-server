export interface ILikeService {
    likePost(username: string, postId: number): Promise<{ success: boolean; message: string; }>;
}