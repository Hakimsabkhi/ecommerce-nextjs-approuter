"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  logoUrl?: string;
  slug: string;
}

const Headerbottom: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const res = await fetch(`/api/category/getAllCategory`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategoryData();
  }, []);

  const toggleListVisibility = () => {
    setOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    setOpen(false);
  };
 // Close dropdown if clicked outside
 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  return (
    <header>
      <nav className="w-full h-[72px] flex justify-center items-center gap-6 bg-primary max-lg:hidden">
        <button
          type="button"
          onClick={toggleListVisibility}
          className='bg-orange-600 text-white font-bold border rounded-xl w-[20%] h-[50%]'
        >
          ALL OUR CATEGORIES
        </button>

        <div className="flex justify-start gap-8 w-[90%] max-xl:w-[95%] font-bold items-center text-white text-base max-2xl:text-xs">
          <Link href={"/"}>HOME</Link>
          <Link href={"/promotion"}>PROMOTION</Link>
        {/*  <Link href={"/blog"}>BLOG</Link> */}
 
        </div>
      </nav>

      {open && (
        <div
          className='absolute flex flex-col px-4 w-[400px] max-md:w-[350px] max-h-64 overflow-y-auto border-[#15335D] border-4 rounded-lg bg-white z-30 left-0'
          ref={dropdownRef} // Close dropdown when clicking outside
        >
          {categories.map((category: Category) => (
            <Link
              href={`/${category.slug}`}
              key={category._id}
              className="flex items-center gap-3 duration-300 hover:text-orange-400"
              aria-label={category.name}
              onClick={handleLinkClick} // Close dropdown on link click
            >
              {category.logoUrl && (
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
      )}
    </header>
  );
};

export default Headerbottom;
