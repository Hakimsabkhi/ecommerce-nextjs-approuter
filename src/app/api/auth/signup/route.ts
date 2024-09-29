import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import UserModel from '@/models/User';

export async function POST(req: NextRequest) {

  
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const lastname = formData.get('lastname') as string;
  const email = (formData.get('email') as string).toLowerCase();
  const password = formData.get('password') as string;
 const role = formData.get('role') as string;
  const username = `${name} ${lastname}`;
  //console.log(formData.get('role'))
  if (!username || !email || !password) {
    return NextResponse.json({ message: 'Username, email, and password are required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: role || 'Visiteur', // Default role if not provided
    });

    await newUser.save();
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


