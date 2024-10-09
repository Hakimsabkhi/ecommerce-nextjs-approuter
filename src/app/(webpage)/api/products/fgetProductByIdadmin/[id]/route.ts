export const dynamic = 'force-dynamic'; 
import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";

// Handler for GET requests
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await dbConnect();
      const { id } = params; // Get `id` from params
      
      if (!id ) { // assuming the MongoDB ObjectId format is 24 characters
        return new NextResponse(JSON.stringify({ message: "Invalid or missing product " }), { status: 400 });
      }
     
     
      await Category.find();
      await Brand.find();
      const product = await Product.findOne({ slug: id,vadmin:"not-approve" })
        .populate("category")
        .populate("brand").exec();
  
      if (!product) {
        return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404});
      }
  
      return new NextResponse(JSON.stringify(product), { status: 200 });
  
    } catch (error) {
      console.error("Error fetching product:", error);
      return new NextResponse(JSON.stringify({ message: "Error fetching product" }), { status: 500 });
    }
  }