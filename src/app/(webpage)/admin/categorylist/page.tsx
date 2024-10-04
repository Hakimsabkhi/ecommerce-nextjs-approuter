import { categories } from '@/assets/data';
import AddedCategories from '@/components/Categorys/FetchAllCategories';
import React from 'react';


  async function fetchcategoryData() {  
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/category/getAllCategory`, {
        method: 'GET',
       
        next: { revalidate: 0 }, // Disable caching to always fetch the latest data
      })
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
  }
const Page = async () => {
    const categories = await fetchcategoryData()
   
    return (
        <div>
            <AddedCategories categories={categories} />        
        </div>
    );
}

export default Page;
