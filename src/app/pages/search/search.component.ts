import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet, SearchFilters } from '../../models/snippet.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedLanguage = signal('');
  selectedTags = signal<string[]>([]);
  showFavoritesOnly = signal(false);
  dateFrom = signal('');
  dateTo = signal('');

  snippets = signal<Snippet[]>([]);
  filteredSnippets = signal<Snippet[]>([]);
  categories = signal<string[]>([]);
  languages = signal<string[]>([]);
  tags = signal<string[]>([]);

  constructor(private snippetService: SnippetService) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    this.snippetService.snippets$.subscribe((snippets) => {
      this.snippets.set(snippets);
      this.updateCategoriesAndLanguages(snippets);
    });

    this.snippetService.categories$.subscribe((categories) => {
      this.categories.set(categories.map((c) => c.name));
    });

    this.snippetService.tags$.subscribe((tags) => {
      this.tags.set(tags.map((t) => t.name));
    });
  }

  private updateCategoriesAndLanguages(snippets: Snippet[]) {
    const uniqueLanguages = [...new Set(snippets.map((s) => s.language))];
    this.languages.set(uniqueLanguages);
  }

  onSearch() {
    this.performSearch();
  }

  onTagToggle(tag: string) {
    const currentTags = this.selectedTags();
    if (currentTags.includes(tag)) {
      this.selectedTags.set(currentTags.filter((t) => t !== tag));
    } else {
      this.selectedTags.set([...currentTags, tag]);
    }
    this.performSearch();
  }

  private performSearch() {
    const filters: SearchFilters = {
      query: this.searchQuery(),
      category: this.selectedCategory(),
      tags: this.selectedTags(),
      language: this.selectedLanguage(),
      isFavorite: this.showFavoritesOnly(),
      dateFrom: this.dateFrom() ? new Date(this.dateFrom()) : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()) : undefined,
    };

    const results = this.snippetService.searchSnippets(filters);
    this.filteredSnippets.set(results);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedLanguage.set('');
    this.selectedTags.set([]);
    this.showFavoritesOnly.set(false);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.filteredSnippets.set([]);
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
    return code.length > 100 ? code.substring(0, 100) + '...' : code;
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.onSearch();
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
    this.onSearch();
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedLanguage.set(target.value);
    this.onSearch();
  }

  onDateFromChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dateFrom.set(target.value);
    this.onSearch();
  }

  onDateToChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dateTo.set(target.value);
    this.onSearch();
  }
}
