export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    userType: string; 
    createdAt?: Date; 
    updatedAt?: Date; 
}

export type Token = {
    id?: number;
    userId: number;
    token: string;
}