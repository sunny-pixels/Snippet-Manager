import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet, SnippetStats } from '../../models/snippet.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats = signal<SnippetStats>({
    totalSnippets: 0,
    totalCategories: 0,
    totalTags: 0,
    recentSnippets: [],
    topLanguages: [],
    topCategories: [],
  });

  recentSnippets = signal<Snippet[]>([]);
  topLanguages = signal<{ language: string; count: number }[]>([]);
  topCategories = signal<{ category: string; count: number }[]>([]);

  constructor(private snippetService: SnippetService) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    // Subscribe to service data
    this.snippetService.snippets$.subscribe((snippets) => {
      this.stats.set(this.snippetService.stats());
      this.recentSnippets.set(this.snippetService.recentSnippets());
    });

    this.snippetService.categories$.subscribe(() => {
      this.stats.set(this.snippetService.stats());
    });

    this.snippetService.tags$.subscribe(() => {
      this.stats.set(this.snippetService.stats());
    });

    // Initialize stats
    this.stats.set(this.snippetService.stats());
    this.recentSnippets.set(this.snippetService.recentSnippets());
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

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      angular: '#dd0031',
      react: '#61dafb',
      css: '#1572b6',
      html: '#e34f26',
      python: '#3776ab',
      general: '#6c757d',
    };
    return colors[category.toLowerCase()] || '#6c757d';
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
}
