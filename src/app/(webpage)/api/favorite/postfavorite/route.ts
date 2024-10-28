import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Favorite from '@/models/Favorite';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';



export async function POST(req: NextRequest) {
    await connectToDatabase();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
    
    try {
      // Handle form data
      const formData = await req.formData();
      const product = formData.get('product_id') as string | null;
      const newFavorite = new Favorite({ product,user });
      await newFavorite.save();
      return NextResponse.json(newFavorite, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: 'Error creating Company' }, { status: 500 });
    }
  }