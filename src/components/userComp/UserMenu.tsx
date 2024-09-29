import React, { useState } from "react";
import Link from "next/link";
import { FaRegUserCircle } from 'react-icons/fa';
import Dropdown from "@/components/Dropdown"
import { useSession } from "next-auth/react";



const UserMenu: React.FC = () => {
  const {data:session}=useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };


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
