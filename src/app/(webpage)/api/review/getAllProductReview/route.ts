import {  NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";
import User from "@/models/User";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import { getToken } from 'next-auth/jwt';
async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await User.findOne({ email: token.email }).exec();
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}


export async function GET(req: NextRequest){
    try{
      await connectToDatabase();
      const result = await getUserFromToken(req);
      if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }// Ensure the database connection is established
      await User.find();
    
      await Category.find();
      await Brand.find();
      const products = await  Products.find({ nbreview: { $gt: 0 }}).populate("user").populate("category").populate("brand").exec();
    
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
  }