import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  settings = signal({
    theme: 'light',
    language: 'en',
    autoSave: true,
    showLineNumbers: true,
    fontSize: 14,
  });

  ngOnInit() {
    // Load settings from localStorage
    if (this.isBrowser()) {
      const savedSettings = localStorage.getItem('snippet-manager-settings');
      if (savedSettings) {
        this.settings.set(JSON.parse(savedSettings));
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  updateSetting(key: string, value: any) {
    this.settings.update((current) => {
      const updated = { ...current, [key]: value };
      if (this.isBrowser()) {
        localStorage.setItem('snippet-manager-settings', JSON.stringify(updated));
      }
      return updated;
    });
  }

  exportData() {
    if (!this.isBrowser()) {
      return;
    }

    const data = {
      snippets: JSON.parse(localStorage.getItem('code-snippet-manager') || '[]'),
      categories: JSON.parse(localStorage.getItem('snippet-categories') || '[]'),
      tags: JSON.parse(localStorage.getItem('snippet-tags') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snippet-manager-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importData(event: any) {
    if (!this.isBrowser()) {
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.snippets)
            localStorage.setItem('code-snippet-manager', JSON.stringify(data.snippets));
          if (data.categories)
            localStorage.setItem('snippet-categories', JSON.stringify(data.categories));
          if (data.tags) localStorage.setItem('snippet-tags', JSON.stringify(data.tags));
          alert('Data imported successfully! Please refresh the page.');
        } catch (error) {
          alert('Invalid file format!');
        }
      };
      reader.readAsText(file);
    }
  }

  clearAllData() {
    if (!this.isBrowser()) {
      return;
    }

    if (confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
      localStorage.removeItem('code-snippet-manager');
      localStorage.removeItem('snippet-categories');
      localStorage.removeItem('snippet-tags');
      alert('All data cleared! Please refresh the page.');
    }
  }

  onThemeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateSetting('theme', target.value);
  }

  onLanguageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateSetting('language', target.value);
  }

  onAutoSaveChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateSetting('autoSave', target.checked);
  }

  onFontSizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateSetting('fontSize', +target.value);
  }

  onShowLineNumbersChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateSetting('showLineNumbers', target.checked);
  }
}
