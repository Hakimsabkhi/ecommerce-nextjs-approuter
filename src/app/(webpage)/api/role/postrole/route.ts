import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Role from '@/models/Role';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });
  if (!user || (user.role !== 'Admin' && user.role !== 'Consulter' && user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
  }

  try {
    // Handle form data
    const formData = await req.formData();
    const name = formData.get('role') as string | null;
   
    // Validate required fields
    if (!name) {
      return NextResponse.json({ message: 'role is required' }, { status: 400 });
    }
    
   
    // Ensure the brand is either new or matches an existing one
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return NextResponse.json({ message: 'role already exists' }, { status: 400 });
    }


    // Save the new brand
    const newRole = new Role({ name, user });
    await newRole.save();
    return NextResponse.json(newRole, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating Role' }, { status: 500 });
  }
}
