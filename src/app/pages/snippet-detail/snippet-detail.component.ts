import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet } from '../../models/snippet.model';

@Component({
  selector: 'app-snippet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './snippet-detail.component.html',
  styleUrl: './snippet-detail.component.css',
})
export class SnippetDetailComponent implements OnInit {
  snippet = signal<Snippet | null>(null);
  snippetId = signal<string | null>(null);

  constructor(
    private snippetService: SnippetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    this.route.params.subscribe((params) => {
      this.snippetId.set(params['id']);
      this.loadSnippet(params['id']);
    });
  }

  private loadSnippet(id: string) {
    const snippet = this.snippetService.getSnippet(id);
    if (snippet) {
      this.snippet.set(snippet);
    } else {
      this.router.navigate(['/snippets']);
    }
  }

  toggleFavorite() {
    const currentSnippet = this.snippet();
    if (currentSnippet) {
      const updated = this.snippetService.updateSnippet(currentSnippet.id, {
        isFavorite: !currentSnippet.isFavorite,
      });
      if (updated) {
        this.snippet.set(updated);
      }
    }
  }

  async deleteSnippet() {
    const currentSnippet = this.snippet();
    if (currentSnippet && confirm('Are you sure you want to delete this snippet?')) {
      try {
        await this.snippetService.deleteSnippet(currentSnippet.id);
        console.log('✅ Snippet deleted successfully');
        this.router.navigate(['/snippets']);
      } catch (error) {
        console.error('❌ Failed to delete snippet:', error);
        alert('Failed to delete snippet. Please try again.');
      }
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  copyToClipboard() {
    const snippet = this.snippet();
    if (snippet) {
      navigator.clipboard.writeText(snippet.code).then(() => {
        // You could add a toast notification here
        alert('Code copied to clipboard!');
      });
    }
  }
}
