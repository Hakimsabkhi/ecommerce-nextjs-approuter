import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
export interface IRole extends Document {
  name: string;
  user: IUser | string; // Reference to a User document or User ID  
  createdAt?: Date;
  updatedAt?: Date;

}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

const Role: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);

export default Role;
