import { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color: string;
  count: number;
}

export const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  count: { type: Number, default: 0 },
});
