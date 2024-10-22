import React, { useState, useEffect, useCallback } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  onSearch: (products: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/searchProduct?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await res.json();
      onSearch(data.products); // Pass the products data back to the parent
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  }, [onSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== "") {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  const handleSearchButtonClick = () => {
    if (!searchTerm.trim()) return;
    handleSearch(searchTerm); // Trigger search manually on button click
  };

  return (
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
        onClick={handleSearchButtonClick} // Use the handleSearch function directly on button click
      >
        <CiSearch className="w-8 h-8 transform duration-500 group-hover:w-10 group-hover:h-10" />
      </button>
    </div>
  );
};

export default SearchBar;
