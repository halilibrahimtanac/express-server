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

export type Post = {
    id: number;
    body: string | null;
    image: string | null;
    video: string | null;
    createdBy?: number | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}