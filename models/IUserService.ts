import { User } from "./Types";

export type ReturnType = { 
  accessToken: string; 
  refreshToken: string; 
  user: Partial<User>; 
};

export interface IUserService {
  register(user: User): Promise<ReturnType>;
  login(email: string, password: string): Promise<ReturnType>;
  refresh(rfrshTkn: string): Promise<string>;
  logout(rfrshTkn: string, accessToken: string): Promise<{ count: number }>;
  profile(username: string): Promise<Partial<User> | null>;
  updateUser(updatedUser: Partial<User>): void;
}
