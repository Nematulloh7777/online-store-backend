import mongoose from "mongoose"
import { Document } from 'mongoose';

export interface IItem extends Document {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
  description?: string;
  user: string;
  [key: string]: any;
}

const ItemSchema = new mongoose.Schema<IItem>(
  {
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: String,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IItem>('Item', ItemSchema)