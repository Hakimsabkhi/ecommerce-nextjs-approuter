export const dynamic = 'force-dynamic'; 
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Role from '@/models/Role';
import User from '@/models/User';



export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure the database connection is established
    await User.find({})
    // Fetch all role but only return the name and imageUrl fields
    const role = await Role.find({}).populate('user','_id username '); // Only select the 'name' and 'imageUrl' fields

    // Return the fetched role names and image URLs
    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    console.error('Error fetching Brand:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
  