"use server"
import fs from 'fs'
import path from 'path'
interface Category {
  _id: string;
  name: string;
  logoUrl?: string;
 
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/category/getAllCategory`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    const data: Category[] = await res.json();
    const filePath = path.join(process.cwd(), '/src/assets/data', 'category.json');
    const filteredData = data.map(category => ({
      name: category.name,
      logoUrl: category.logoUrl,
    }));
    fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2), 'utf8');
    // console.log('Fetched categories from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};