import { PrismaClient, Token } from "@prisma/client";
import { ITokenRepository } from "../models/ITokenRepository";
import BaseRepository from "./BaseRepository";

class TokenRepository extends BaseRepository implements ITokenRepository {
  constructor(dbClient: PrismaClient) {
    super(dbClient);
  }
  
  async getUserToken(tkn: string) {
    return await this.dbClient.token.findFirst({
      select: {
        userId: true,
        token: true,
        user: { select: { username: true, email: true, userType: true } },
      },
      where: { token: tkn },
    });
  }

  async addUserToken(tokenObj: Token) {
    return await this.dbClient.token.create({
      data: { userId: tokenObj.userId, token: tokenObj.token },
    });
  }

  async removeUserToken(tkn: string) {
    return await this.dbClient.token.deleteMany({ where: { token: tkn } });
  }
}

export default TokenRepository;
