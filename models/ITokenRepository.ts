import { Token, User } from "./User";

export interface ITokenRepository {
    getUserToken(tkn: string): Promise<{ user: Partial<User>} & Partial<Token>  | null>;
    removeUserToken(tkn: string): Promise<{ count: number }>;
    addUserToken(token: Token): Promise<Token>;
}