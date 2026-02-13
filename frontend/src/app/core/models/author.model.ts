export interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  email: string;
  avatarUrl: string;
  articleCount: number;
}

export interface AuthorCreate {
  name: string;
  slug?: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
}
