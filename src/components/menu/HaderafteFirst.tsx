"use client";

import React, { useEffect, useState } from "react";
import { SlBag } from "react-icons/sl";
import { CiSearch } from "react-icons/ci";
import CartModal from "../CartModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Total from "./Total";

const HaderafteFirst = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartmodalRef = React.useRef<HTMLDivElement>(null);
  const items = useSelector((state: RootState) => state.cart.items);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  //for search
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Toggle cart modal with useCallback for performance optimization
  const toggleCartModal = React.useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // Handle clicks outside the cart modal
  useEffect(() => {
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

  // Track scroll and close the modal when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setIsScrolling(true); // Apply scrolling styles
        setIsCartOpen(false); // Close the cart modal on scroll
      } else {
        setIsScrolling(false); // Reset scrolling styles
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate total quantity from items
  useEffect(() => {
    if (items) {
      const quantity = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setTotalQuantity(quantity);
    }
  }, [items]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Call the API whenever the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        const res = await fetch(
          `/api/searchProduct?searchTerm=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error searching for products:", error);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
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

  const handleLinkClick = () => {
    setSearchTerm(""); // Clear the search term
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-around w-[80%] max-lg:w-fit">
        {/* Main header content */}
        <div className="relative w-[750px] max-2xl:w-[500px] max-xl:w-[250px] max-lg:hidden">
          <input
            className="w-full h-12 px-4 py-2 rounded-full max-lg:hidden border border-gray-300"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products"
            aria-label="Search for products"
          />
          <button
            className="absolute h-full px-4 group right-0 top-1/2 -translate-y-1/2 rounded-r-full text-[#15335D]"
            aria-label="Search"
            onClick={handleSearch}
          >
            <CiSearch className="w-8 h-8 transform duration-500 group-hover:w-10 group-hover:h-10" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 w-[200px] max-lg:w-fit text-white">
          <div className="relative" ref={cartmodalRef}>
            <div className="relative cursor-pointer" onClick={toggleCartModal}>
              <SlBag size={25} />
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
                <p>{totalQuantity}</p>
              </span>
            </div>
            <div className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 -translate-x-1/2 ">
            {isCartOpen && items.length > 0 && <CartModal items={items} />}
          </div>  </div>
          <Total items={items} />
        </div>
      </div>

      {/* Fixed header clone */}
      {isScrolling && (
        <div className="fixed top-5 right-5 rounded-full z-50 bg-[#15335D] w-fit p-4 flex items-center gap-4 border-10 border-black">
          <div className="relative" ref={cartmodalRef}>
            <div className="relative cursor-pointer text-white" onClick={toggleCartModal}>
              <SlBag size={25} />
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-primary">
                <p>{totalQuantity}</p>
              </span>
            </div>
            <div className="absolute bg-white shadow-xl z-30 flex gap-2 flex-col top-0 right-12">
            {isCartOpen && items.length > 0 && <CartModal items={items} />}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default HaderafteFirst;
