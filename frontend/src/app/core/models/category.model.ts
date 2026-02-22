export interface Category {
  id: number;
  name: string;
  slug: string;
  displayName: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  type: string;
  sortOrder: number;
  articleCount: number;
  translations?: CategoryTranslation[];
}

export interface CategoryTranslation {
  language: string;
  name: string;
  displayName: string;
  description?: string;
}

export interface CategoryCreate {
  name: string;
  slug?: string;
  displayName: string;
  description?: string;
  emoji?: string;
  color?: string;
  bgColor?: string;
  type: string;
  sortOrder?: number;
  translations?: CategoryTranslation[];
}
