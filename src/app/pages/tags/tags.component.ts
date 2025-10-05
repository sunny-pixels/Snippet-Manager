import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnippetService } from '../../services/snippet.service';
import { Tag } from '../../models/snippet.model';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css',
})
export class TagsComponent implements OnInit {
  tags = signal<Tag[]>([]);

  constructor(private snippetService: SnippetService) {}

  ngOnInit() {
    // Initialize service in browser environment
    this.snippetService.initializeInBrowser();

    this.snippetService.tags$.subscribe((tags) => {
      this.tags.set(tags);
    });
  }
}
