"use client";

import React, { useEffect, useRef, useState } from "react";
import { SlBag } from "react-icons/sl";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Total from "./Total";
import CartModal from "../CartModal";
import CartModalOnscroll from "../CartModalOnscroll";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const HaderafteFirst = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOnscrollCart, setIsOnscrollCart] = useState(false);
  const items = useSelector((state: RootState) => state.cart.items);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const cartModalWrapperRef = useRef<HTMLDivElement>(null);
  const onscrollCartModalWrapperRef = useRef<HTMLDivElement>(null); // New ref for onscroll modal
  const pathname = usePathname();

  const toggleCartModal = () => {
    setIsOnscrollCart(false);
    setIsCartOpen((prev) => !prev);
  };

  const toggleCartOnscrollModal = () => {
    setIsOnscrollCart(true);
    setIsCartOpen((prev) => !prev);
  };

  const closeCartModal = () => {
    setIsCartOpen(false);
  };

  // Handle clicks outside of the cart modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCartOpen && !isOnscrollCart && cartModalWrapperRef.current && !cartModalWrapperRef.current.contains(event.target as Node)) {
        closeCartModal();
      }
      if (isCartOpen && isOnscrollCart && onscrollCartModalWrapperRef.current && !onscrollCartModalWrapperRef.current.contains(event.target as Node)) {
        closeCartModal();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, isOnscrollCart]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (isCartOpen) {
        closeCartModal();
      }
      setIsScrolling(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCartOpen]);

  // Calculate total quantity of items in the cart
  useEffect(() => {
    if (items) {
      const quantity = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setTotalQuantity(quantity);
    }
  }, [items]);

  // Close cart on route change
  useEffect(() => {
    closeCartModal();
  }, [pathname]);

  return (
    <>
      <div className="flex gap-4 items-center justify-around w-[80%] max-lg:w-fit">
        <SearchBar onSearch={() => {}} />
        <div
          className="flex items-center justify-center gap-4 w-[200px] max-lg:w-fit text-white cursor-pointer select-none"
          ref={cartModalWrapperRef}
          onClick={toggleCartModal}
        >
          <div className="relative">
            <SlBag size={25} />
            <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
              <p>{totalQuantity}</p>
            </span>

            <div
              className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 -translate-x-1/2"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              {isCartOpen && !isOnscrollCart && items.length > 0 && (
                <CartModal items={items} onClose={closeCartModal} />
              )}
            </div>
          </div>
          <Total items={items} />
        </div>
      </div>

      {/* Show the floating cart button when scrolling */}
      {isScrolling && (
        <div
          className="fixed top-5 right-5 rounded-full z-50 bg-[#15335D] w-fit p-4 flex items-center gap-4 border-10 border-black select-none"
          ref={onscrollCartModalWrapperRef} // Use the new ref for onscroll cart modal
          onClick={toggleCartOnscrollModal}
        >
          <div className="relative">
            <SlBag size={25} className="text-white" />
            <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
              <p>{totalQuantity}</p>
            </span>

            {/* Scrolling Cart Modal */}
            <div
                   className="absolute max-md:fixed shadow-xl z-30 flex gap-2 top-12 right-0 flex-col max-md:top-[53%] max-md:right-[50%] max-md:transform max-md:translate-x-1/2 max-md:-translate-y-1/2 transition-all duration-900 ease-in-out "
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              {isCartOpen && isOnscrollCart && items.length > 0 && (
                <CartModalOnscroll items={items} onClose={closeCartModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HaderafteFirst;
