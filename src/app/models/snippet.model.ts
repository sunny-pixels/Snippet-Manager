export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
  language: string;
  isFavorite: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SnippetStats {
  totalSnippets: number;
  totalCategories: number;
  totalTags: number;
  recentSnippets: Snippet[];
  topLanguages: { language: string; count: number }[];
  topCategories: { category: string; count: number }[];
}
