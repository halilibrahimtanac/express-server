import jwt from 'jsonwebtoken';
import { User } from '../models/User';

class JWTService {
    private static instance: JWTService;
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    
    private constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    }

    public static getInstance(): JWTService {
        if (!JWTService.instance) {
            JWTService.instance = new JWTService();
        }
        return JWTService.instance;
    }

    public generateAccessToken(user: Partial<User>): string {
        return jwt.sign(
            { 
                username: user.username,
                email: user.email,
                userType: user.userType 
            },
            this.accessTokenSecret,
            { expiresIn: '15m' }
        );
    }

    public generateRefreshToken(user: Partial<User>): string {
        return jwt.sign(
            { 
                username: user.username,
                email: user.email,
                userType: user.userType 
            },
            this.refreshTokenSecret,
            { expiresIn: '7d' }
        );
    }

    public verifyAccessToken(token: string): any {
        return jwt.verify(token, this.accessTokenSecret);
    }

    public verifyRefreshToken(token: string): any {
        return jwt.verify(token, this.refreshTokenSecret);
    }
}

export default JWTService;
