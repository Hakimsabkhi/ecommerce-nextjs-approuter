"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';


interface Category {
  _id: string;
  name: string;
  logoUrl?: string;
  slug: string;
}

const Headerbottom: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [delayedStyles, setDelayedStyles] = useState<any[]>([]);

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
    if (!open) {
      setAnimating(true);
      setDelayedStyles([]); // Reset the delayed styles for each animation
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
    setAnimating(false); // Stop animation if the link is clicked
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (animating && open) {
      // Create delayed animation effects for each category item
      const timeouts: any[] = [];
      categories.forEach((_, index) => {
        timeouts.push(
          setTimeout(() => {
            setDelayedStyles((prevStyles) => [
              ...prevStyles,
              { opacity: 1, transform: 'translateY(0)' },
            ]);
          }, index * 100) // Delay each item by 100ms
        );
      });

      // Clear timeouts when the component unmounts or is closed
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [animating, open, categories]);

  return (
    <header>
      <nav className="w-full h-[72px] flex justify-center items-center gap-6 bg-primary  ">
       <div  className="flex justify-center items-center w-[20%] h-[90%] max-2xl:w-[30%] max-xl:w-[40%] max-lg:w-[60%] max-md:text-[82%] max-sm:w-[100%] max-sm:text-[60%]">
        <button
          type="button"
          onClick={toggleListVisibility}
          className="bg-orange-600 text-white font-bold flex justify-center items-center gap-6 max-sm:gap-1 w-[80%] h-full "
        >
          <FaBars />

          ALL OUR CATEGORIES
        </button>
        </div>
        <div className="flex justify-start gap-8 w-[90%] max-xl:w-[95%] font-bold items-center text-white text-base max-2xl:text-xs">
          <Link href={"/"}>HOME</Link>
          <Link href={"/promotion"}>PROMOTION</Link>
        </div>
      </nav>

      <div
        className={`absolute flex flex-col  w-[400px] max-md:w-[350px] max-h-64 max-sm:w-[90%] 
          max-sm:left-0 overflow-y-auto border-[#15335D] border-4 rounded-lg bg-white z-30 left-8 
          transition-all duration-300 ease-in-out 
          ${open ? 'max-h-96 max-sm:max-h-[100%] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {open && categories.map((category: Category, index: number) => (
          <Link
            href={`/${category.slug}`}
            key={category._id}
            className="flex items-center gap-3 pl-4 duration-300 hover:bg-slate-400  hover:text-white border-b-2"
            aria-label={category.name}
            onClick={handleLinkClick}
            style={{
              opacity: delayedStyles[index]?.opacity || 0, // Apply the animated opacity
              transform: delayedStyles[index]?.transform || 'translateY(10px)', // Apply the translateY for animation
              transition: 'opacity 0.5s, transform 0.5s ease-out', // Animation timing
            }}
          >
            <div className='flex gap-6 justify-center items-center h-16'>
            {category.logoUrl && (
              <Image
                src={category.logoUrl}
                alt={category.name}
                width={40}
                height={40}
                className="rounded-full object-cover "
              />
            )}
            <span className='font-bold text-xl'>{category.name}</span>
            </div>
          </Link>
      
        ))}
      </div>
    </header>
  );
};

export default Headerbottom;
