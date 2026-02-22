export interface Author {
  id: number;
  name: string;
  slug: string;
  bio: string;
  email: string;
  avatarUrl: string;
  articleCount: number;
  translations?: AuthorTranslation[];
}

export interface AuthorTranslation {
  language: string;
  bio: string;
}

export interface AuthorCreate {
  name: string;
  slug?: string;
  bio?: string;
  email?: string;
  avatarUrl?: string;
  translations?: AuthorTranslation[];
}
