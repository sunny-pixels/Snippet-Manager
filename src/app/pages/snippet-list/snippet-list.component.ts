import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet, SearchFilters } from '../../models/snippet.model';

@Component({
  selector: 'app-snippet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './snippet-list.component.html',
  styleUrl: './snippet-list.component.css',
})
export class SnippetListComponent implements OnInit {
  snippets = signal<Snippet[]>([]);
  filteredSnippets = signal<Snippet[]>([]);
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedLanguage = signal('');
  showFavoritesOnly = signal(false);

  categories = signal<string[]>([]);
  languages = signal<string[]>([]);

  constructor(private snippetService: SnippetService) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    this.snippetService.snippets$.subscribe((snippets) => {
      console.log('Snippet list received snippets:', snippets.length);
      this.snippets.set(snippets);
      this.filteredSnippets.set(snippets);
      this.updateCategoriesAndLanguages(snippets);
    });

    this.snippetService.categories$.subscribe((categories) => {
      console.log('Snippet list received categories:', categories.length);
      this.categories.set(categories.map((c) => c.name));
    });

    // Force refresh after a short delay to ensure service is initialized
    setTimeout(() => {
      console.log('Force refreshing snippet list...');
      this.snippets.set(this.snippetService.snippets());
      this.filteredSnippets.set(this.snippetService.snippets());
    }, 100);
  }

  private updateCategoriesAndLanguages(snippets: Snippet[]) {
    const uniqueLanguages = [...new Set(snippets.map((s) => s.language))];
    this.languages.set(uniqueLanguages);
  }

  onSearch() {
    this.applyFilters();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.applyFilters();
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
    this.applyFilters();
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedLanguage.set(target.value);
    this.applyFilters();
  }

  onFavoritesToggle() {
    this.showFavoritesOnly.set(!this.showFavoritesOnly());
    this.applyFilters();
  }

  private applyFilters() {
    const filters: SearchFilters = {
      query: this.searchQuery(),
      category: this.selectedCategory(),
      tags: [],
      language: this.selectedLanguage(),
      isFavorite: this.showFavoritesOnly(),
    };

    const filtered = this.snippetService.searchSnippets(filters);
    this.filteredSnippets.set(filtered);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedLanguage.set('');
    this.showFavoritesOnly.set(false);
    this.filteredSnippets.set(this.snippets());
  }

  async deleteSnippet(id: string) {
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        await this.snippetService.deleteSnippet(id);
        console.log('✅ Snippet deleted successfully');
      } catch (error) {
        console.error('❌ Failed to delete snippet:', error);
        alert('Failed to delete snippet. Please try again.');
      }
    }
  }

  toggleFavorite(snippet: Snippet) {
    this.snippetService.updateSnippet(snippet.id, {
      isFavorite: !snippet.isFavorite,
    });
  }

  getLanguageColor(language: string): string {
    const colors: { [key: string]: string } = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      html: '#e34f26',
      css: '#1572b6',
      python: '#3776ab',
      java: '#f89820',
      csharp: '#239120',
      php: '#777bb4',
      go: '#00add8',
      rust: '#000000',
      swift: '#fa7343',
      kotlin: '#7f52ff',
      dart: '#0175c2',
      vue: '#4fc08d',
      react: '#61dafb',
      angular: '#dd0031',
    };
    return colors[language.toLowerCase()] || '#6c757d';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getSnippetPreview(code: string): string {
    return code.length > 150 ? code.substring(0, 150) + '...' : code;
  }

  // Test method to manually add a snippet for testing
  async addTestSnippet() {
    console.log('Adding test snippet...');
    const testSnippet = {
      title: 'Test Snippet',
      description: 'This is a test snippet',
      code: 'console.log("Hello World");',
      language: 'javascript',
      category: 'General',
      tags: ['test', 'javascript'],
      isFavorite: false,
    };

    try {
      const newSnippet = await this.snippetService.addSnippet(testSnippet);
      console.log('✅ Test snippet added:', newSnippet);
    } catch (error) {
      console.error('❌ Failed to add test snippet:', error);
    }
  }

  // Debug methods
  debugDatabase() {
    console.log('=== API CONNECTION DEBUG ===');
    console.log('API connection status:', this.snippetService.getAPIConnectionStatus());
    console.log('Current snippets in service:', this.snippetService.snippets().length);
    console.log('Current categories in service:', this.snippetService.categories().length);
    console.log('Current tags in service:', this.snippetService.tags().length);
    console.log('=============================');
  }

  async forceReload() {
    console.log('🔄 Force reloading data from database...');
    await this.snippetService.initializeInBrowser();
  }
}
