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
    const formData = await req.json();
    const newRole = formData.get('newRole') as number | null;
   console.log("aezez",newRole)

    return NextResponse.json(/* role */ { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating Role' }, { status: 500 });
  }
}
