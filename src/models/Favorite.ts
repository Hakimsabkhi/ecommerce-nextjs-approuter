import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';  // Import the IUser interface
import { IProduct } from './Product';  // Import the IProduct interface


// Interface for the Favorite document
export interface IFavorite extends Document {
  product: IProduct|string;
  user: IUser | string; 
  createdAt?: Date;
  updatedAt?: Date;
}


// Define the product schema
const FavoriteSchema = new mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Product reference must exist
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Ensure Favorite is associated with a user

}, { timestamps: true });

// Create and export the Favorite model
const Favorite: Model<IFavorite> = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
export default Favorite;
