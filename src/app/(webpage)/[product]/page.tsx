import React from 'react';
import Products from '@/components/Products';
import Chairsbanner from '@/components/Chairsbanner';
import { ICategory } from '@/models/Category';
import { notFound } from 'next/navigation';

interface HomePageProps {
  params: {
    product?: string;
  };
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
}

interface Brand {
  _id: string;
  name: string;
}

// Fetch category data by ID
const fetchCategoryData = async (id: string): Promise<ICategory | null> => {
  try {
    if (!id) return notFound(); // Check if id is valid
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/searchcategory/${id}`, {
      method: 'GET',
    });

    if (!res.ok) {
      console.log('Category not found');
      return notFound();
    }

    const data: ICategory = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    return notFound();
  }
};

// Fetch products data by category ID
const fetchProductsData = async (id: string): Promise<ProductData[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/search/${id}`, {
      method: 'GET',
      next: { revalidate: 0 }, // Disable caching
    });

    if (!res.ok) {
      throw new Error('Products not found');
    }

    const data: ProductData[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products data:', error);
    return [];
  }
};

// Fetch brand data
const fetchBrandData = async (): Promise<Brand[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/brand/getAllBrand`, {
      method: 'GET',
      next: { revalidate: 0 }, // Disable caching
    });

    if (!res.ok) {
      throw new Error('Brand not found');
    }

    const data: Brand[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return [];
  }
};

// HomePage component
async function HomePage({ params }: HomePageProps) {
  const id = params?.product;

  // Early return if no product id
  if (!id) {
    return notFound();
  }

  const category = await fetchCategoryData(id);
  const products = await fetchProductsData(id);
  const brand = await fetchBrandData();

  // Return 404 if no category or products found
  if (!category || products.length === 0) {
    return notFound();
  }

  return (
    <div>
      {/* Uncomment the following if you need to show a banner */}
      <Chairsbanner category={category} />
      <Products products={products} brands={brand} />
    </div>
  );
}

// Export the HomePage component at the end
export default HomePage;
