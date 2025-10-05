import { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  description: string;
}

export const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  description: { type: String, default: '' },
});
