import { PrismaClient } from "@prisma/client";
import { ITokenRepository } from "../models/ITokenRepository";
import { Token } from "../models/Types";
import BaseRepository from "./BaseRepository";
import JWTService from "../services/JWTService";

class TokenRepository extends BaseRepository implements ITokenRepository {
  constructor(dbClient: PrismaClient, private jwtService: JWTService) {
    super(dbClient);
  }
  
  async getUserToken(tkn: string) {
    return await this.dbClient.token.findFirst({
      select: {
        userId: true,
        token: true,
        user: { select: { username: true, email: true, userType: true, profilePicture: true } },
      },
      where: { token: tkn },
    });
  }
  
  async addUserToken(token: Token): Promise<Token> {
    const result = await this.dbClient.token.create({
      data: {
        userId: token.userId,
        token: token.token,
        type: token.type
      },
    });
    
    return {
      id: result.id,
      userId: result.userId,
      token: result.token,
      type: result.type as "refresh" | "access"
    };
  }
  
  async removeUserToken(rTkn: string, aTkn: string): Promise<{ count: number }> {
    const result = await this.dbClient.token.deleteMany({ 
      where: { OR: [{ token: rTkn }, { token: aTkn }] } 
    });

    return { count: result.count };
  }

  async refreshToken(rfrshTkn: string) {
    try {
      const verified = this.jwtService.verifyRefreshToken(rfrshTkn);
      const foundResult = await this.getUserToken(rfrshTkn);
      if (!foundResult) {
        throw new Error("Invalid token! (Not found in database)");
      }

      const accessToken = this.jwtService.generateAccessToken({
        ...foundResult.user,
      });

      await this.addUserToken({
        userId: foundResult.userId as number,
        token: accessToken,
        type: "access"
      });

      return { accessToken, user: foundResult.user };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default TokenRepository;
