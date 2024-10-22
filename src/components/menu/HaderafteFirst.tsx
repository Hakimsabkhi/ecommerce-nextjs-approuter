"use client";

import React, { useEffect, useState } from "react";
import { SlBag } from "react-icons/sl";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Total from "./Total";
import CartModal from "../CartModal";
import CartModalOnscroll from "../CartModalOnscroll";
import SearchBar from "./SearchBar";

const HaderafteFirst = () => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Single state for both CartModal and CartModalOnscroll
  const [isOnscrollCart, setIsOnscrollCart] = useState(false); // State to differentiate between normal and on-scroll modal
  const items = useSelector((state: RootState) => state.cart.items);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // This line is added to fix the error

  // Toggle cart modal in the header
  const toggleCartModal = () => {
    setIsOnscrollCart(false); // Ensure normal cart modal is triggered
    setIsCartOpen((prev) => !prev); // Toggle the modal based on its previous state
  };

  // Toggle cart modal when scrolling (floating button)
  const toggleCartOnscrollModal = () => {
    setIsOnscrollCart(true); // Set this to true for the on-scroll modal
    setIsCartOpen((prev) => !prev); // Toggle the modal based on its previous state
  };

  const closeCartModal = () => {
    setIsCartOpen(false);
  };

  // Optimize the scroll event listener and handle scroll-triggered changes
  useEffect(() => {
    const handleScroll = () => {
      if (isCartOpen) {
        closeCartModal(); // Close the cart modal on scroll
      }

      // Handle showing the fixed header
      setIsScrolling(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCartOpen]);

  // Update total quantity when items in the cart change
  useEffect(() => {
    if (items) {
      const quantity = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setTotalQuantity(quantity);
    }
  }, [items]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(
        `/api/searchProduct?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setProducts(data.products); // Update products state with the search results
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-around w-[80%] max-lg:w-fit">
        {/* Main header content */}
        <SearchBar onSearch={handleSearch} />
        <div
          className="flex items-center justify-center gap-4 w-[200px] max-lg:w-fit text-white cursor-pointer"
          onClick={toggleCartModal} // Toggle main cart modal
        >
          <div className="relative">
            <SlBag size={25} />
            <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
              <p>{totalQuantity}</p>
            </span>
            <div className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 -translate-x-1/2">
              {isCartOpen && !isOnscrollCart && items.length > 0 && (
                <CartModal items={items} onClose={closeCartModal} />
              )}
            </div>
          </div>
          <Total items={items} />
        </div>
      </div>

      {/* Fixed floating cart when scrolling */}
      {isScrolling && (
        <div
          className="fixed top-5 right-5 rounded-full z-50 bg-[#15335D] w-fit p-4 flex items-center gap-4 border-10 border-black"
          onClick={toggleCartOnscrollModal} // Toggle onscroll cart modal
        >
          <div className="relative">
            <SlBag size={25} className="text-white" />
            <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
              <p>{totalQuantity}</p>
            </span>
            <div className="absolute shadow-xl z-30 flex gap-2 flex-col top-0 right-12">
              {isCartOpen && isOnscrollCart && items.length > 0 && (
                <div onClick={(event) => event.stopPropagation()}>
                  <CartModalOnscroll
                    items={items}
                    onClose={closeCartModal} // Close passed as prop
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HaderafteFirst;
