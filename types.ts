export interface Users {
  id: number;
  username: string;
  email: string;
  posts: Posts[];
}
export interface Posts {
  id: number;
  title: string;
  description: string;
  postedDate: string;
  user: Users;
  tagIds: number[];
}

export type RowData = Omit<Users, "Posts">;
