
export const dynamic = 'force-dynamic';  // Ensures dynamic rendering

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Favorite from '@/models/Favorite';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure the database connection is established
    const id = req.nextUrl.searchParams.get('email');
    await Product.find();
    await Category.find();
    // Fetch all categories but only return the name and imageUrl fields
    const favorite = await Favorite.find({user:id}).populate({
        path: 'product',
        populate: {
          path: 'category', // Assuming you have a category field in the Product model
          select: 'name slug imageUrl', // Select fields to return for the category
        },
      })
      .exec();// Only select the 'name' and 'imageUrl' fields

    // Return the fetched category names and image URLs
    return NextResponse.json(favorite, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
  }