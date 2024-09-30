import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  phone:string;
  email: string;
  password?: string;
  role:  'SuperAdmin' | 'Admin' | 'Consulter' | 'Visiteur';
  googleId?: string;
  createdAt?: Date;
  updatedAt?: Date;

}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  phone:{type:String},
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum:  ['SuperAdmin', 'Admin', 'Consulter', 'Visiteur'] , default:'Visiteur'},
   googleId: { type: String, unique: true }, 
},{ timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
