import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import categories from "@/assets/data/category.json"; // Adjust path if needed

// Type definition for category data (if you're using TypeScript)
interface Category {
  name: string;
  logoUrl?: string;
}

const Headerbottom: React.FC = () => {

  if (categories.length === 0) {
    return <div>Aucune catégorie trouvée</div>;
  }

  return (
    <header>
      <nav className="w-full h-[72px] flex justify-center bg-white max-lg:hidden">
        <div className="flex justify-between w-[90%] max-xl:w-[95%] font-bold items-center text-xl max-2xl:text-sm">
          {categories.map((category: Category) => (
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