import { PrismaClient } from "@prisma/client";
import BaseRepository from "./BaseRepository";
import { User } from "../models/Types";
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

  async getUserByUserName<T extends keyof User>(
    username: string,
    selectFields: T[]
  ): Promise<Pick<User, T> | null> {
    // Convert the array of fields into a Prisma "select" object
    const select = selectFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<T, boolean>);

    // Fetch the user with the selected fields
    const user = await this.dbClient.user.findUnique({
      where: { username },
      select,
    });

    // Cast the result to `Pick<User, T> | null` to satisfy TypeScript
    return user as Pick<User, T> | null;
  }
}

export default UserRepository;
