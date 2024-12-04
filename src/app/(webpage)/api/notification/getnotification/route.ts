export const dynamic = 'force-dynamic'; 
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/order';
import User from '@/models/User';
import Notification from '@/models/Notifications';
import { getToken } from 'next-auth/jwt';



export async function GET(req: NextRequest) {


  try {
    await connectToDatabase(); // Ensure the database connection is established
  
    
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email:token.email});
    // Parse the request body
    if (!user){
        return NextResponse.json({ success: false, message: "Missing required connect" }, { status: 505 });
    }
  
 await User.find();
    await Order.find();
    // Fetch all notfication but only return the name and imageUrl fields
  
    const notifications = await Notification.find({seen:'false'}).populate({
      path: 'order',
      select: 'ref createdAt',
       // Select specific fields from the order
      populate: [
        { path: 'user', select: 'username' } // Select specific fields from user
      ]
    }).sort({ createdAt: -1 });
    

    // Return the fetched notfication 
    return new NextResponse(JSON.stringify(notifications), { status: 200 });
  
  } catch (error) {
    console.error('Error fetching notfication:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}