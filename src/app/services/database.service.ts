import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import mongoose, { Connection, Model } from 'mongoose';
import { ISnippet, SnippetSchema } from '../models/mongodb/snippet.schema';
import { ICategory, CategorySchema } from '../models/mongodb/category.schema';
import { ITag, TagSchema } from '../models/mongodb/tag.schema';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private connection: Connection | null = null;
  private isConnected = false;

  // Models
  public SnippetModel: Model<ISnippet> | null = null;
  public CategoryModel: Model<ICategory> | null = null;
  public TagModel: Model<ITag> | null = null;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      console.log('🔄 Attempting to connect to MongoDB...');
      console.log('📍 URI:', environment.mongodb.uri.replace('<db_password>', '***'));

      await mongoose.connect(environment.mongodb.uri, {
        dbName: environment.mongodb.dbName,
      });

      this.connection = mongoose.connection;
      this.isConnected = true;

      // Initialize models
      this.SnippetModel = mongoose.model<ISnippet>('Snippet', SnippetSchema);
      this.CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
      this.TagModel = mongoose.model<ITag>('Tag', TagSchema);

      console.log('✅ Successfully connected to MongoDB!');
      console.log('📊 Database:', environment.mongodb.dbName);
      console.log('🔗 Connection state:', this.connection.readyState);

      // Set up connection event listeners
      this.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      this.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      this.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnected = false;
    }
  }

  public async ensureConnection(): Promise<boolean> {
    if (!this.isConnected || !this.connection) {
      console.log('🔄 Reconnecting to MongoDB...');
      await this.connect();
    }
    return this.isConnected;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}
