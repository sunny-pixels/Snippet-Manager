import { Schema, Document } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const SnippetSchema = new Schema<ISnippet>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    code: { type: String, required: true },
    language: { type: String, required: true },
    category: { type: String, default: '' },
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
