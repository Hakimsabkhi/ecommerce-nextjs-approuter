import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    // Connect to your MongoDB database
    await connectToDatabase();

    // Fetch all categories, selecting only name and imageUrl
    const categories = await Category.find({}, 'name imageUrl').exec();

    // Return the fetched categories as JSON
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching categories:', error);

    // Return an error response in case of failure
    return NextResponse.json({ message: 'Error fetching categories', error: error.message }, { status: 500 });
  }
}
