import React from "react";
import "../app/globals.css";
import ProductList from "./Products/ProductPage/ProductList";

interface ProductsProps {
  products: ProductData[];
  brands: Barnd[];
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand: Barnd;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
}

interface Barnd {
  _id: string;
  name: string;
}

const Products: React.FC<ProductsProps> = ({ products, brands }) => {
  
  return (
    <div className="flex py-8 desktop max-md:w-[95%] justify-center gap-8 max-md:items-center max-md:flex-col">
      {/* filter */}
    
      <div className="flex-col flex w-full justify-between">
        {/* products */}
        <ProductList
          products={products}
        />
      
      </div>
    </div>
  );
};

export default Products;