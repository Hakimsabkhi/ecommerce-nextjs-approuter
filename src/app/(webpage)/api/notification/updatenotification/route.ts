import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Notifications from "@/models/Notifications";
import { getToken } from "next-auth/jwt";
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    await connectToDatabase();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user || user.role !== 'Admin' && user.role !== 'Consulter'&& user.role !== 'SuperAdmin') {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    try {
      // Handle form data
      const id = params.id; // Get ID from params
      const formData = await req.formData();
      
     /*  const imageFile = formData.get("image") as File | null;
      const logoFile = formData.get("logo") as File | null;
      const bannerFile = formData.get("banner") as File | null;
    
  
      if (!id) {
        return NextResponse.json(
          { message: "ID  are required" },
          { status: 400 }
        );
      }
  
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
  
      
      // Update category with new values
      existingCategory.name = name;
      await existingCategory.save();
   */
      return NextResponse.json(/* existingCategory, */ { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating category", error },
        { status: 500 }
      );
    }
  }
  
  
