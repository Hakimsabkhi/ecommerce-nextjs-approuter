
export const dynamic = 'force-dynamic'; 
import {  NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";

export async function GET(){
    try{
      await connectToDatabase();
      const products = await  Products.find({});
    
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
  }