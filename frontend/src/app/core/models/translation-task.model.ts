export interface TranslationTask {
  id: number;
  entityType: string;
  entityId: number;
  entityTitle: string;
  sourceLang: string;
  targetLang: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationStats {
  pending: number;
  inProgress: number;
  done: number;
}
