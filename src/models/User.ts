import mongoose from "mongoose"
import { Document } from 'mongoose';
import { IItem } from "./Items";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  favorites: IItem[];
  toggleFavorite: (item: IItem) => Promise<void>;
  [key: string]: any;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    favorites: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Item' 
    }],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toggleFavorite = async function (itemId: string) {
  const index = this.favorites.findIndex((fav: any) => fav._id.toString() === itemId);

  if (index === -1) {
    this.favorites.push(itemId); // Добавление в избранное
  } else {
    this.favorites.splice(index, 1); // Удаление из избранного
  }

  await this.save();
};

export default mongoose.model<IUser>('User', UserSchema)