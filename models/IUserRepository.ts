import { PrismaClient } from "@prisma/client";
import { User } from "./User";

export interface IDBClient {
    dbClient: PrismaClient,
}

export interface IUserRepository {
    addUser(user: User): Promise<User>,
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<Partial<User> | null>;
}