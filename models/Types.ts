export type User = {
  id: number;
  name?: string | null;
  lastname?: string | null;
  username: string;
  email: string;
  profilePicture?: string | null;
  birthDate?: Date | null;
  password: string;
  userType: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Token = {
  id?: number;
  userId: number;
  token: string;
  type: "refresh" | "access";
};

export type Post = {
  id: number;
  body: string | null;
  image: string | null;
  video: string | null;
  createdBy?: number | null;
  parentPost?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export interface GetPostsOptions {
  username?: string;
  field?: keyof Post;
  value?: any;
}
