import mongoose ,{Document,Model}from 'mongoose';
import { IUser } from './User'; // Import the IUser interface
import { ICategory } from './Category';  
import { IBrand } from './Brand';
export interface IProduct extends Document {
  name: string;
  info:string;
  description?: string;
  ref:string;
  price: number;
  imageUrl?: string;
  images?: string []; 
  material?:string;
  color?:string;
  dimensions?:string;
  warranty?:string,
  category: ICategory | string;//Reference to a category document or category ID
  brand: IBrand | string;//Reference to a brand document or brand ID 
  stock: number;
  user: IUser | string; // Reference to a User document or User ID
  discount?: number;
  weight?:string;
  status:string;
  statuspage:string;
  vadmin:string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
// Helper function to slugify product names
const slugifyProductName = (name: string, ref: string): string => {
  return `${name.toLowerCase().replace(/ /g, '-')}-${ref.toLowerCase().replace(/ /g, '-')}`;
};

const ProductSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  info:{ type: String, required: true },
  description: { type: String },
  ref: { type: String, required: true },
  material:{ type: String},
  dimensions:{ type: String },
  color:{type:String},
  warranty:{ type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  stock:  { type: Number, required: true },
  price:  { type: Number, required: true },
  discount: { type: Number},
  weight:{type:String},
  status: { type: String, default: 'in stock' },
  statuspage:{ type: String,default:'none'},
  vadmin:{ type: String,default:'not-approve'},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String },
  images: [{ type: String }], 
  slug: { type: String},
},{ timestamps: true });

// Pre-save hook to generate the slug before saving the product
ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isModified('ref')) {
    this.slug = slugifyProductName(this.name, this.ref);
  }
  next();
});


const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
  export default Product