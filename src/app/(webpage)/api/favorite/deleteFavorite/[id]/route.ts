
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Favorite from "@/models/Favorite";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    await connectToDatabase();
  
  
    const { id } = params;
  
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing order ID" },
        { status: 400 }
      );
    }
  
    try {
   
      const favorite = await Favorite.findById(id);
      if (!favorite) {
        return NextResponse.json(
          { message: "favorite not found" },
          { status: 404 }
        );
      }
  
 
      await Favorite.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "favorite deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error deleting favorite" },
        { status: 500 }
      );
    }
  }
