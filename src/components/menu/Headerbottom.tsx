import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Type definition for category data (if you're using TypeScript)
interface Category {
  _id:string;
  name: string;
  logoUrl?: string;
  slug:string;
}


async function fetchcategoryData() {  
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/category/getAllCategory`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
      throw new Error('Failed to fetch data');
  }
  return res.json();
}


const Headerbottom: React.FC = async () => {
 const categories = await  fetchcategoryData()
  if (categories.length === 0) {
    return <></>;
  }

  return (
    <header>
      <nav className="w-full h-[72px] flex justify-center bg-primary max-lg:hidden">
        <div className="flex justify-between gap-8 w-[90%] max-xl:w-[95%] font-bold items-center text-white text-base max-2xl:text-xs max-lg:text">
          {categories?.map((category: Category) => (
            <Link 
              href={`/${category.slug}`} 
              key={category._id} 
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