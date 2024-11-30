"use client"
import { useState } from 'react';
import Link from 'next/link';

const NavAdmin = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <nav className="bg-gray-800 w-[100%] relative ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
           
              <p
               
                className={`text-white font-bold text-xl cursor-pointer `}
              >
                Dashboard
              </p>
           
          </div>
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-baseline space-x-4">
            <Link href="/admin/users">
                <p
                  onClick={() => handleClick('users')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'users' ? 'bg-gray-700' : ''
                  }`}
                >
                  Users
                </p>
              </Link>
              <Link href="/admin/brandlist">
                <p
                  onClick={() => handleClick('brandlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'brandlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Brands
                </p>
              </Link>
              <Link href="/admin/categorylist">
                <p
                  onClick={() => handleClick('categorylist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'categorylist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Categories
                </p>
              </Link>
              <Link href="/admin/productlist">
                <p
                  onClick={() => handleClick('productlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'productlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Products
                </p>
              </Link>
              <Link href="/admin/promotionlist">
                <p
                  onClick={() => handleClick('promotionlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'promotionlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Promation
                </p>
              </Link>
              <Link href="/admin/reviewlist">
                <p
                  onClick={() => handleClick('reviewlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'reviewlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Reviews
                </p>
              </Link>
              <Link href="/admin/orderlist">
                <p
                  onClick={() => handleClick('orderlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'orderlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Orders
                </p>
              </Link>
              <Link href="/admin/invoice">
                <p
                  onClick={() => handleClick('invoice')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'invoice' ? 'bg-gray-700' : ''
                  }`}
                >
                  Invoice
                </p>
              </Link>
              <Link href="/admin/company">
                <p
                  onClick={() => handleClick('company')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'company' ? 'bg-gray-700' : ''
                  }`}
                >
                  Company
                </p>
              </Link>
              <Link href="/admin/revenue">
                <p
                  onClick={() => handleClick('revenue')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'revenue' ? 'bg-gray-700' : ''
                  }`}
                >
                  Revenue
                </p>
              </Link>
              <Link href="/admin/users/role">
                <p
                  onClick={() => handleClick('role')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'role' ? 'bg-gray-700' : ''
                  }`}
                >
                  Revenue
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavAdmin;
