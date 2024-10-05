import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Type definition for category data (if you're using TypeScript)
interface Category {
  name: string;
  logoUrl?: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/category/getAllCategory`, {
      method: 'GET',
     
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    })
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: Category[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


const Headerbottom = async () => {
  // Fetch categories in a server component
  const categories = await fetchCategories();

  if (categories.length === 0) {
    return null; // No categories found
  }

  return (
    <header>
      <nav className="w-full h-[72px] flex justify-center bg-white max-lg:hidden">
        <div className="flex justify-between w-[90%] max-xl:w-[95%] font-bold items-center text-xl max-2xl:text-sm">
          {categories?.map((category: Category) => (
            <Link 
              href={`/${category.name}`} 
              key={category.name} 
              className="flex items-center gap-3 duration-300 hover:text-orange-400" 
              aria-label={category.name}
            >
              {category?.logoUrl && (
                <Image
                  src={category.logoUrl}
                  alt={category.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Headerbottom;