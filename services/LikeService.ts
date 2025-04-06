import { ILikeRepository } from "../models/ILikeRepository";
import { ILikeService } from "../models/ILikeService";

class LikeService implements ILikeService {
    constructor(private likeRepository: ILikeRepository){}

    async likePost(username: string, postId: number): Promise<{ success: boolean; message: string; }> {
        return await this.likeRepository.likePost(username, postId);
    }
}

export default LikeService;