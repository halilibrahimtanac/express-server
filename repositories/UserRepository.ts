import { PrismaClient } from "@prisma/client";
import BaseRepository from "./BaseRepository";
import { User } from "../models/User";
import { IUserRepository } from "../models/IUserRepository";

class UserRepository extends BaseRepository implements IUserRepository {
  constructor(dbClient: PrismaClient) {
    super(dbClient);
  }

  async addUser(user: User) {
    return await this.dbClient.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        userType: user.userType,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.dbClient.user.findUnique({ where: { email } });
  }

  async getUserById(id: number) {
    return await this.dbClient.user.findUnique({ select: { id: true, username: true, email: true, createdAt: true, userType: true }, where: { id } });
  }
}

export default UserRepository;
