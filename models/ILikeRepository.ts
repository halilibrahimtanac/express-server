export interface ILikeRepository {
    likePost(username: string, postId: number): Promise<{ success: boolean; message: string; }>;
}