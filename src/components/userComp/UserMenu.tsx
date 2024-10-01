'use client'; // This component will be rendered on the client-side

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegUserCircle } from 'react-icons/fa';
import Dropdown from "@/components/Dropdown";
import { useSession } from "next-auth/react";

const UserMenu: React.FC = () => {
  const { data: session } = useSession(); // Get session data and status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 /*  const [isLoading, setIsLoading] = useState(true); // State to track loading
 */
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

/*   useEffect(() => {
    if (status === "loading") {
      setIsLoading(true); // Set loading to true while fetching
    } else {
      setIsLoading(false); // Set loading to false after fetching
    }
  }, [status]); */

/*   // Display a loading state or the user menu based on session
  if (isLoading) {
    return <></>; // Optional loading indicator
  } */

  if (session?.user) {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-4 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 w-[269px] bg-white font-bold text-primary"
        >
          <FaRegUserCircle size={25} />
          <p>MON COMPTE</p>
        </button>

        {isDropdownOpen && (
          <Dropdown
            username={session.user.name ?? ""}
            role={session.user.role ?? ""}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-[269px]">
      <Link href="/signin" aria-label="Sign in page">
        <button
          aria-label="Sign in"
          className="flex items-center space-x-2 text-white bg-primary hover:bg-white hover:text-primary font-bold rounded-md px-8 py-2"
        >
          <span>LOGIN</span>
        </button>
      </Link>
      <Link href="/signup" aria-label="Sign up page">
        <button
          aria-label="Register"
          className="flex items-center space-x-2 text-primary bg-white hover:text-white hover:bg-primary font-bold rounded-md px-8 py-2"
        >
          <span>REGISTER</span>
        </button>
      </Link>
    </div>
  );
};

export default UserMenu;
