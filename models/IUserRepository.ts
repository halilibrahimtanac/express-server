import { User } from "./Types";

export interface IUserRepository {
    addUser(user: User): Promise<User>,
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<Partial<User> | null>;
    getUserByUserName<T extends keyof User>(username: string, selectedFields: T[]): Promise<Partial<User> | null>;
}