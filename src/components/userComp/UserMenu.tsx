"use client"; // UserMenu remains a client component

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import Dropdown from "@/components/Dropdown";
import { Session } from "next-auth";

interface UserMenuProps {
  session: Session | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ session }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (session) {
    return (
      <div className="flex items-center justify-center w-[200px] max-lg:w-fit text-white cursor-pointer select-none" >
        <div className="flex items-center justify-center gap-2 w-fit max-lg:w-fit text-white" ref={dropdownRef} onClick={toggleDropdown}>
          <div  className="relative my-auto mx-2" >
            <AiOutlineUser size={40} />

            {isDropdownOpen && (
              <div
                className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 -translate-x-1/5"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
              >
                <Dropdown
                  username={session.user?.name ?? ""}
                  role={session.user?.role ?? ""}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[#C1C4D6] text-sm">My Account</p>
            <p className="text-white font-bold">Details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
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
