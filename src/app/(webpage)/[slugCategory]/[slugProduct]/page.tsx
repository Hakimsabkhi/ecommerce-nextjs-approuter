import React from "react";
import { notFound } from "next/navigation";
import FirstBlock from "@/components/Products/SingleProduct/FirstBlock";
import SecondBlock from "@/components/Products/SingleProduct/SecondBlock";

import ForthBlock from "@/components/Products/SingleProduct/ForthBlock";
import FifthBlock from "@/components/Products/SingleProduct/FifthBlock";

interface Product {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  tva?: number; // Ensure this is included in ProductData as well
  price: number;
  imageUrl?: string;
  images?: string[];
  brand?: Brand; // Make brand optional
  stock: number;
  category: category; // Corrected 'category' interface name
  dimensions?: string;
  discount?: number;
  warranty?: number;
  weight?: number;
  color?: string;
  material?: string;
  status?: string;
}
interface category{
  _id:string;
  name:string;
  slug:string;
}

interface Brand {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
}

interface User {
  username: string;
}

interface PageProps {
  product: Product ;
}

// Fetch product data on the server
 async function getProduct(id: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}api/products/fgetProductById/${id}`
    , {
      method: 'GET',
     
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    })
  if (!res.ok) {
    console.log("Product not found");
    notFound();
  }
  const data: Product = await res.json();
  return data;
}


// Fetch the product data during server-side rendering
export default async function Page({ params }: { params: {slugCategory: string ,slugProduct:string} }) {
  
  const product = await getProduct(params.slugProduct);

  if (params.slugCategory != product.category.slug){
    notFound();
  }
  if (!product) {
    notFound(); // Redirects to a 404 page if the product is not found
  }

  return (
    <div>
      <FirstBlock product={product} />
      <SecondBlock product={product} />
      <ForthBlock product={product} />
      <FifthBlock/>
    </div>
  );
};