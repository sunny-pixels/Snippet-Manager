import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnippetService } from '../../services/snippet.service';
import { Category } from '../../models/snippet.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  newCategoryName = signal('');
  newCategoryColor = signal('#007bff');

  constructor(private snippetService: SnippetService) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    this.snippetService.categories$.subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  addCategory() {
    const name = this.newCategoryName().trim();
    if (name) {
      this.snippetService.addCategory({
        name,
        color: this.newCategoryColor(),
        description: '',
      });
      this.newCategoryName.set('');
    }
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.snippetService.deleteCategory(id);
    }
  }
}
