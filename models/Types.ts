export type User = {
  id: number;
  username: string;
  email: string;
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
