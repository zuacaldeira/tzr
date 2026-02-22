import { Category } from './category.model';
import { Author } from './author.model';
import { Tag } from './tag.model';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: Category;
  author: Author;
  tags: Tag[];
  cardEmoji: string;
  coverImageUrl: string;
  coverImageCredit: string;
  status: string;
  academic: boolean;
  featured: boolean;
  publishedDate: string;
  readingTimeMinutes: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  translations?: ArticleTranslation[];
}

export interface ArticleList {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: Category;
  author: Author;
  tags: Tag[];
  cardEmoji: string;
  coverImageUrl: string;
  status: string;
  academic: boolean;
  featured: boolean;
  publishedDate: string;
  readingTimeMinutes: number;
}

export interface ArticleTranslation {
  language: string;
  title: string;
  excerpt: string;
  body: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTimeMinutes?: number;
}

export interface ArticleCreate {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  categoryId: number;
  authorId: number;
  tagIds?: number[];
  cardEmoji?: string;
  coverImageUrl?: string;
  coverImageCredit?: string;
  status?: string;
  academic?: boolean;
  featured?: boolean;
  publishedDate?: string;
  readingTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  translations?: ArticleTranslation[];
}
