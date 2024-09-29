import React, { useEffect, useState } from "react";

import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { SlBag } from "react-icons/sl";
import { CiSearch } from "react-icons/ci";
import UserMenu from "../userComp/UserMenu";
import CartModal from "../CartModal";

import { luxehome } from "@/assets/image";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import Total from "./Total";


interface Category {
  id: string;
  name: string;
  logoUrl: string;
}


const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const cartmodalRef = React.useRef<HTMLDivElement>(null);

  const items = useSelector((state: RootState) => state.cart.items);

  const [totalQuantity, setTotalQuantity] = useState(0);
  // Toggle cart modal with useCallback for performance optimization
  const toggleCartModal = React.useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // Handle clicks outside the cart modal
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartmodalRef.current &&
        !cartmodalRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (items) {
      // Ensure items is defined and calculate total quantity
      const quantity = items.reduce((total, item) => total + (item.quantity || 0), 0);
      setTotalQuantity(quantity);
    }
  }, [items]);

  return (
    <div className="w-full max-lg:fixed max-lg:z-10 h-[109px] bg-[#15335E] justify-center flex max-lg:hidden ">
      <div className="flex w-[90%] max-xl:w-[95%] max-lg:hidden justify-between gap-14 items-center max-lg:bg-white">
        <Link href="/" aria-label="Home page">
          <div className="mb-1">
            <Image
              width={250}
              height={250}
              className="h-auto lg:w-[400px] xl:w-[300px] rounded-[5px] max-lg:hidden"
              src={luxehome}
              alt="Luxe Home logo"
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <div className="relative w-[800px]">
          <input
            className="w-full h-12 px-4 py-2 rounded-full max-lg:hidden border border-gray-300"
            type="text"
            placeholder="Search for products"
            aria-label="Search for products"
          />
          <button
            className="absolute h-full px-4 group right-0 top-1/2 -translate-y-1/2 rounded-r-full text-[#15335D]"
            aria-label="Search"
          >
            <CiSearch className="w-8 h-8 transform duration-500 group-hover:w-10 group-hover:h-10" />
          </button>
        </div>
      
        <div className="flex items-center gap-4 w-[133px] text-white">
          <FiHeart size={25} />
          <div className="relative" ref={cartmodalRef}>
            <div className="relative cursor-pointer" onClick={toggleCartModal}>
              <SlBag size={25} />
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
                <p>{totalQuantity}</p>
              </span>
            </div>
            {isCartOpen && items.length>0&&<CartModal items={items} />}
          </div>
          
         <Total items={items}/>
        </div>
        <UserMenu  />
      </div>
    </div>
  );
};

export default Header;
