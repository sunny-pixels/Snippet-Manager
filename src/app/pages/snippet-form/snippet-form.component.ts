import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SnippetService } from '../../services/snippet.service';
import { Snippet, Category } from '../../models/snippet.model';

@Component({
  selector: 'app-snippet-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snippet-form.component.html',
  styleUrl: './snippet-form.component.css',
})
export class SnippetFormComponent implements OnInit {
  isEditMode = signal(false);
  snippetId = signal<string | null>(null);

  formData = signal({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    category: '',
    tags: [] as string[],
    isFavorite: false,
  });

  categories = signal<Category[]>([]);
  availableLanguages = [
    'javascript',
    'typescript',
    'html',
    'css',
    'python',
    'java',
    'csharp',
    'php',
    'go',
    'rust',
    'swift',
    'kotlin',
    'dart',
    'vue',
    'react',
    'angular',
    'json',
    'xml',
    'sql',
    'bash',
  ];

  newTag = signal('');

  constructor(
    private snippetService: SnippetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    // Load categories immediately
    this.categories.set(this.snippetService.categories());
    console.log('📂 Categories loaded:', this.categories());

    this.snippetService.categories$.subscribe((categories) => {
      this.categories.set(categories);
      console.log('📂 Categories updated:', categories);
    });

    // Test backend connection
    this.testBackendConnection();

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.snippetId.set(params['id']);
        this.loadSnippet(params['id']);
      }
    });
  }

  async testBackendConnection() {
    try {
      console.log('🧪 Testing backend connection...');
      const response = await fetch('http://localhost:3000/api/test');
      const data = await response.json();
      console.log('✅ Backend connection test:', data);
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      console.error('💡 Make sure backend is running: npm run server');
    }
  }

  private loadSnippet(id: string) {
    const snippet = this.snippetService.getSnippet(id);
    if (snippet) {
      this.formData.set({
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        category: snippet.category,
        tags: [...snippet.tags],
        isFavorite: snippet.isFavorite,
      });
    }
  }

  onTitleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formData.update((data) => ({ ...data, title: target.value }));
  }

  onDescriptionInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.formData.update((data) => ({ ...data, description: target.value }));
  }

  onCodeInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.formData.update((data) => ({ ...data, code: target.value }));
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.formData.update((data) => ({ ...data, language: target.value }));
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.formData.update((data) => ({ ...data, category: target.value }));
  }

  onNewTagInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newTag.set(target.value);
  }

  addTag() {
    const tag = this.newTag().trim();
    if (tag && !this.formData().tags.includes(tag)) {
      this.formData.update((data) => ({
        ...data,
        tags: [...data.tags, tag],
      }));
      this.newTag.set('');
    }
  }

  removeTag(tag: string) {
    this.formData.update((data) => ({
      ...data,
      tags: data.tags.filter((t) => t !== tag),
    }));
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  toggleFavorite() {
    this.formData.update((data) => ({
      ...data,
      isFavorite: !data.isFavorite,
    }));
  }

  async onSubmit() {
    if (!this.formData().title.trim() || !this.formData().code.trim()) {
      alert('Please fill in the title and code fields.');
      return;
    }

    if (this.isEditMode()) {
      const updated = this.snippetService.updateSnippet(this.snippetId()!, this.formData());
      if (updated) {
        this.router.navigate(['/snippets', this.snippetId()]);
      }
    } else {
      try {
        const newSnippet = await this.snippetService.addSnippet(this.formData());
        this.router.navigate(['/snippets', newSnippet.id]);
      } catch (error) {
        console.error('Failed to save snippet:', error);
        alert('Failed to save snippet. Please try again.');
      }
    }
  }

  onCancel() {
    if (this.isEditMode()) {
      this.router.navigate(['/snippets', this.snippetId()]);
    } else {
      this.router.navigate(['/snippets']);
    }
  }
}
