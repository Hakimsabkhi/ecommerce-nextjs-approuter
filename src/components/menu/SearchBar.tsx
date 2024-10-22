import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

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
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    onSearch(searchTerm);
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
        onClick={handleSearch}
      >
        <CiSearch className="w-8 h-8 transform duration-500 group-hover:w-10 group-hover:h-10" />
      </button>
    </div>
  );
};

export default SearchBar;
