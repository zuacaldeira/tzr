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
}
