import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Snippet, Category, Tag, SearchFilters, SnippetStats } from '../models/snippet.model';

@Injectable({
  providedIn: 'root',
})
export class SnippetService {
  private snippetsSubject = new BehaviorSubject<Snippet[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private tagsSubject = new BehaviorSubject<Tag[]>([]);

  public snippets$ = this.snippetsSubject.asObservable();
  public categories$ = this.categoriesSubject.asObservable();
  public tags$ = this.tagsSubject.asObservable();

  // Signals for reactive UI
  public snippets = signal<Snippet[]>([]);
  public categories = signal<Category[]>([]);
  public tags = signal<Tag[]>([]);

  // Computed values
  public stats = computed(() => this.calculateStats());
  public recentSnippets = computed(() =>
    this.snippets()
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
  );

  private isInitialized = false;

  constructor(private http: HttpClient) {
    // Always initialize with default values first
    this.snippets.set([]);
    this.categories.set(this.getDefaultCategories());
    this.tags.set([]);

    // If we're in browser, load from API immediately
    if (this.isBrowser()) {
      this.loadFromAPI();
      this.isInitialized = true;
    }
  }

  // Method to initialize when browser is available (called from components)
  initializeInBrowser(): void {
    if (this.isBrowser()) {
      if (!this.isInitialized) {
        this.loadFromAPI();
        this.isInitialized = true;
      } else {
        this.loadFromAPI();
      }
    }
  }

  // Snippet CRUD operations
  async addSnippet(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Snippet> {
    try {
      console.log('🔄 Attempting to add snippet to database...');

      const response = await this.http
        .post<any>('http://localhost:3000/api/snippets', snippet)
        .toPromise();

      if (response && response._id) {
        console.log('✅ SUCCESS: Snippet added to database!');
        console.log('📄 Snippet Details:', {
          id: response._id,
          title: response.title,
          language: response.language,
          category: response.category,
          tags: response.tags,
          createdAt: response.createdAt,
        });

        // Convert API response to our interface
        const snippetData: Snippet = {
          id: response._id,
          title: response.title,
          description: response.description,
          code: response.code,
          language: response.language,
          category: response.category,
          tags: response.tags,
          isFavorite: response.isFavorite,
          createdAt: new Date(response.createdAt),
          updatedAt: new Date(response.updatedAt),
        };

        // Update local state
        const snippets = [...this.snippets(), snippetData];
        this.updateSnippets(snippets);
        this.updateTagsFromSnippets(snippets);

        return snippetData;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ ERROR: Failed to add snippet to database');
      console.error('🔍 Error Details:', error);
      console.error('💡 Possible causes:');
      console.error('   - Backend server not running (check: npm run server)');
      console.error('   - MongoDB connection issue');
      console.error('   - Network connectivity problem');
      console.error('   - Invalid snippet data');
      throw error;
    }
  }

  updateSnippet(id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>): Snippet | null {
    const snippets = this.snippets().map((snippet) =>
      snippet.id === id ? { ...snippet, ...updates, updatedAt: new Date() } : snippet
    );

    const updatedSnippet = snippets.find((s) => s.id === id);
    if (updatedSnippet) {
      this.updateSnippets(snippets);
      this.updateTagsFromSnippets(snippets);
      return updatedSnippet;
    }
    return null;
  }

  async deleteSnippet(id: string): Promise<boolean> {
    try {
      console.log('🔄 Attempting to delete snippet from database...');

      const response = await this.http
        .delete(`http://localhost:3000/api/snippets/${id}`)
        .toPromise();

      console.log('✅ SUCCESS: Snippet deleted from database!');
      console.log('🗑️ Deleted snippet ID:', id);

      // Update local state
      const snippets = this.snippets().filter((snippet) => snippet.id !== id);
      this.updateSnippets(snippets);
      this.updateTagsFromSnippets(snippets);

      return true;
    } catch (error) {
      console.error('❌ ERROR: Failed to delete snippet from database');
      console.error('🔍 Error Details:', error);
      console.error('💡 Possible causes:');
      console.error('   - Backend server not running (check: npm run server)');
      console.error('   - MongoDB connection issue');
      console.error('   - Network connectivity problem');
      console.error('   - Snippet not found in database');
      throw error;
    }
  }

  getSnippet(id: string): Snippet | undefined {
    return this.snippets().find((snippet) => snippet.id === id);
  }

  // Search and filter
  searchSnippets(filters: SearchFilters): Snippet[] {
    let results = this.snippets();

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(query) ||
          snippet.description.toLowerCase().includes(query) ||
          snippet.code.toLowerCase().includes(query) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      results = results.filter((snippet) => snippet.category === filters.category);
    }

    if (filters.tags.length > 0) {
      results = results.filter((snippet) => filters.tags.some((tag) => snippet.tags.includes(tag)));
    }

    if (filters.language) {
      results = results.filter((snippet) => snippet.language === filters.language);
    }

    if (filters.isFavorite) {
      results = results.filter((snippet) => snippet.isFavorite);
    }

    if (filters.dateFrom) {
      results = results.filter((snippet) => snippet.createdAt >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      results = results.filter((snippet) => snippet.createdAt <= filters.dateTo!);
    }

    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Category management
  addCategory(category: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
    };

    const categories = [...this.categories(), newCategory];
    this.updateCategories(categories);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Category | null {
    const categories = this.categories().map((category) =>
      category.id === id ? { ...category, ...updates } : category
    );

    const updatedCategory = categories.find((c) => c.id === id);
    if (updatedCategory) {
      this.updateCategories(categories);
      return updatedCategory;
    }
    return null;
  }

  deleteCategory(id: string): boolean {
    // Check if any snippets use this category
    const snippetsUsingCategory = this.snippets().some((snippet) => snippet.category === id);
    if (snippetsUsingCategory) {
      return false; // Cannot delete category that's in use
    }

    const categories = this.categories().filter((category) => category.id !== id);
    this.updateCategories(categories);
    return true;
  }

  // Tag management
  addTag(tag: Omit<Tag, 'id' | 'count'>): Tag {
    const existingTag = this.tags().find((t) => t.name === tag.name);
    if (existingTag) {
      return existingTag;
    }

    const newTag: Tag = {
      ...tag,
      id: this.generateId(),
      count: 0,
    };

    const tags = [...this.tags(), newTag];
    this.updateTags(tags);
    return newTag;
  }

  // Statistics
  private calculateStats(): SnippetStats {
    const snippets = this.snippets();
    const categories = this.categories();
    const tags = this.tags();

    const languageCounts = snippets.reduce((acc, snippet) => {
      acc[snippet.language] = (acc[snippet.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryCounts = snippets.reduce((acc, snippet) => {
      acc[snippet.category] = (acc[snippet.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSnippets: snippets.length,
      totalCategories: categories.length,
      totalTags: tags.length,
      recentSnippets: this.recentSnippets(),
      topLanguages: Object.entries(languageCounts)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topCategories: Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    };
  }

  // API operations
  private async loadFromAPI(): Promise<void> {
    try {
      const snippets = await this.http.get<any[]>('http://localhost:3000/api/snippets').toPromise();

      if (snippets) {
        const snippetData: Snippet[] = snippets.map((doc: any) => ({
          id: doc._id,
          title: doc.title,
          description: doc.description,
          code: doc.code,
          language: doc.language,
          category: doc.category,
          tags: doc.tags,
          isFavorite: doc.isFavorite,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        }));

        console.log('✅ SUCCESS: Loaded snippets from database');
        console.log('📊 Data Summary:', {
          totalSnippets: snippetData.length,
          languages: [...new Set(snippetData.map((s) => s.language))],
          categories: [...new Set(snippetData.map((s) => s.category).filter((c) => c))],
        });

        this.snippets.set(snippetData);
        this.snippetsSubject.next(snippetData);
        this.updateTagsFromSnippets(snippetData);
      }
    } catch (error) {
      console.error('❌ ERROR: Failed to load snippets from database');
      console.error('🔍 Error Details:', error);
      console.error('💡 Possible causes:');
      console.error('   - Backend server not running (check: npm run server)');
      console.error('   - MongoDB connection issue');
      console.error('   - Network connectivity problem');

      // Fallback to default values
      this.snippets.set([]);
      this.categories.set(this.getDefaultCategories());
      this.tags.set([]);
    }
  }

  // Debug method to check current state
  debugState(): void {
    console.log('=== SERVICE STATE DEBUG ===');
    console.log('Current service state:');
    console.log('- Snippets:', this.snippets().length);
    console.log('- Categories:', this.categories().length);
    console.log('- Tags:', this.tags().length);
    console.log('============================');
  }

  private updateSnippets(snippets: Snippet[]): void {
    this.snippets.set(snippets);
    this.snippetsSubject.next(snippets);
  }

  private updateCategories(categories: Category[]): void {
    this.categories.set(categories);
    this.categoriesSubject.next(categories);
    // Categories are now managed in memory only
  }

  private updateTags(tags: Tag[]): void {
    this.tags.set(tags);
    this.tagsSubject.next(tags);
    // Tags are now managed in memory only, derived from snippets
  }

  private updateTagsFromSnippets(snippets: Snippet[]): void {
    const tagCounts = snippets.reduce((acc, snippet) => {
      snippet.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const updatedTags = this.tags().map((tag) => ({
      ...tag,
      count: tagCounts[tag.name] || 0,
    }));

    // Add new tags that don't exist yet
    Object.entries(tagCounts).forEach(([name, count]) => {
      if (!updatedTags.find((tag) => tag.name === name)) {
        updatedTags.push({
          id: this.generateId(),
          name,
          color: this.getRandomColor(),
          count,
        });
      }
    });

    this.updateTags(updatedTags);
  }

  private getDefaultCategories(): Category[] {
    return [
      { id: '1', name: 'JavaScript', color: '#f7df1e', description: 'JavaScript code snippets' },
      { id: '2', name: 'TypeScript', color: '#3178c6', description: 'TypeScript code snippets' },
      { id: '3', name: 'Angular', color: '#dd0031', description: 'Angular framework snippets' },
      { id: '4', name: 'React', color: '#61dafb', description: 'React library snippets' },
      { id: '5', name: 'CSS', color: '#1572b6', description: 'CSS styling snippets' },
      { id: '6', name: 'HTML', color: '#e34f26', description: 'HTML markup snippets' },
      { id: '7', name: 'Python', color: '#3776ab', description: 'Python code snippets' },
      { id: '8', name: 'General', color: '#6c757d', description: 'General purpose snippets' },
    ];
  }

  private getRandomColor(): string {
    const colors = [
      '#007bff',
      '#28a745',
      '#dc3545',
      '#ffc107',
      '#17a2b8',
      '#6f42c1',
      '#e83e8c',
      '#fd7e14',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Force reload from API
  forceReload(): void {
    console.log('🔄 Force reloading data from database...');
    this.loadFromAPI();
  }

  // Expose API connection status for debugging
  getAPIConnectionStatus(): boolean {
    return true; // Always true for HTTP calls
  }
}
