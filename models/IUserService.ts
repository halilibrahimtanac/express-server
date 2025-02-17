import { User } from "./User";

export type ReturnType = { 
  accessToken: string; 
  refreshToken: string; 
  user: Partial<User>; 
};

export interface IUserService {
  register(user: User): Promise<ReturnType>;
  login(email: string, password: string): Promise<ReturnType>;
  refreshToken(rfrshTkn: string, user: Partial<User>): Promise<string>;
  logout(rfrshTkn: string): Promise<{ count: number }>;
  profile(id: number): Promise<Partial<User> | null>;
}
