
import Image from 'next/image';
import React from 'react';
import Link from "next/link"
import {
    luxehome
} from '@/assets/image';
import { CiShop, CiShoppingCart,CiUser } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { GoHeart } from "react-icons/go";
import { CiPhone } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

interface Address {
    _id: string;
    governorate: string;
    city: string;
    address: string;
    zipcode: number;
  }
  
  interface CompanyData {
    name: string;
    addresse: Address;
    email: string;
    phone: number;
    logoUrl:string
  }
  async function fetchCompanyData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company/getCompany`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next:{revalidate:0},
      });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}
  

 
  

export default async function Bb() {
    const companyData = await fetchCompanyData();
    const formatPhoneNumber = (phone: string | number): string => {
        // Convert number to string if needed
        const phoneStr = phone.toString().trim();
      
        // Check if the length of the phone number is correct
        if (phoneStr.length === 8) {
          return `${phoneStr.slice(0, 2)} ${phoneStr.slice(2, 5)} ${phoneStr.slice(5)}`;
        }
      
        // Handle other cases (e.g., longer or shorter phone numbers)
        return phoneStr;
      };
      

  
    if (!companyData) {
      return <></>;
    }
    return (
        
            <div className="pt-8 flex flex-col justify-center items-center">
            <div className='bg-[#15335D] text-white justify-center flex py-16 max-md:py-8 w-full'>
                <div className='flex items-start justify-between md:max-lg:justify-around w-[80%] max-xl:w-[90%] max-lg:w-[98%] max-md:w-[95%] max-md:flex-col max-md:items-center max-md:gap-10'>
                    <div className='flex flex-col gap-8  items-center'>                    
                        <Image src={companyData.logoUrl} width={261} height={261} alt="luxehome" />
                        <div className="gap-5 flex flex-col max-md:items-center "> 
                            <p>{companyData.zipcode} {companyData.city} {companyData.governorate}, Tunisie</p>
                            <p className="flex items-center gap-2 "><CiPhone size={25} /> +216 {formatPhoneNumber(companyData.phone)}</p>
                            <p className='flex gap-2 items-center'><CiMail  size={25}/> {companyData.email}</p>                                           
                        </div>
                    </div>
                    <div className=" flex w-1/3 max-md:w-full justify-between max-md:justify-center items-center max-md:gap-20 md:max-lg:hidden ">
                        <div className='flex-col flex gap-4'>
                            <p className="text-white  text-xl max-md:text-2xl  ">Quick links</p>
                            <div className='flex-col gap-2 text-xs max-md:text-base flex'>
                                <Link href="/">
                                    <p className="   hover:text-white cursor-pointer">
                                        Home
                                    </p>
                                </Link>
                            
                                <Link href="/about">
                                    <p className="   hover:text-white cursor-pointer">
                                        About
                                    </p>
                                </Link>
                                <Link href="/contactus">
                                    <p className="   hover:text-white cursor-pointer">
                                        Contact Us
                                    </p>
                                </Link>
                                <Link href="#">
                                    <p className="   hover:text-white cursor-pointer">
                                        Annonce
                                    </p>
                                </Link>
                                <Link href="#">
                                    <p className="   hover:text-white cursor-pointer">
                                        Services
                                    </p>
                                </Link>
                                <Link href="/blog">
                                    <p className="   hover:text-white cursor-pointer">
                                        Blogs
                                    </p>
                                </Link>
                                <Link href="/">
                                    <p className="   hover:text-white cursor-pointer">
                                        devenez vendeur
                                    </p>
                                </Link>                                
                            </div>
                        </div>
                        <div className='flex flex-col mb-6 max-md:mb-9 gap-4 '>
                            <p className="text-white  text-xl max-md:text-2xl ">Découverte</p>                            
                            <ul className='flex flex-col text-xs max-md:text-base gap-2'>
                                <li className="   hover:text-white cursor-pointer">
                                    Monastir
                                </li>
                                <li className="   hover:text-white cursor-pointer">
                                    Sousse
                                </li>
                                <li className="  hover:text-white cursor-pointer">
                                    Mahdia
                                </li>
                                <li className="   hover:text-white cursor-pointer">
                                    Nabeul
                                </li>
                                <li className="   hover:text-white cursor-pointer">
                                    Sfax
                                </li>
                            </ul>                                                        
                        </div>                    
                    </div>
                    <div className='flex flex-col gap-4  items-center'>
                        <p className='max-md:text-2xl max-sm:text-xl'>Abonnez-vous a notre newsletter!</p>
                        <div className="relative w-full">
                            <input
                                className="w-full h-12 px-4 py-2 max-md:h-16 rounded-full border text-black border-gray-300 pr-16"
                                type="text"
                                placeholder="Email address"
                            />
                            <div className=" absolute right-2 top-1/2 group overflow-hidden  -translate-y-1/2">
                                <button className="relative  py-2 w-[40px] h-[40px] max-md:w-[50px] max-md:h-[50px] hover:bg-[#15335D]     px-2   rounded-full text-white bg-primary  "
                                        aria-label="send">                                        
                                </button>
                                <FaArrowRight className="absolute cursor-pointer top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 duration-500 lg:group-hover:translate-x-[250%]" />
                                <FaArrowRight className="absolute cursor-pointer  top-1/2 right-[150%] -translate-y-1/2 translate-x-1/2 duration-500 lg:group-hover:translate-x-[300%]" />
                            </div>
                        </div>
                        <p className="max-md:text-xl">Suivez-nous sur</p>
                        <div className='flex  items-center gap-2'>                            
                            <FaLinkedinIn className="hover:text-[#0077b5]"  size={25} />                            
                            <FaFacebookF className="hover:text-black" size={25} />
                            <FaInstagram className='hover:bg-gradient-to-r from-orange-500 overflow-hidden rounded-lg via-pink-500 to-indigo-500 ' fill="currentcolor" size={25} />                            
                        </div>
                    </div>
                </div>
            </div>
        
                <div className="w-[85%] items-center justify-between text-[#525566] font-bold max-lg:w-[95%] max-md:text-[10px] flex max-md:flex-col gap-2">
                    <p>© {companyData.name} - All rights reserved</p>
                    <div className=" flex items-center gap-4">
                        <p>Terms and conditions</p>
                        <p>Privacy Policy</p>
                        <p>Disclaimer</p>
                    </div>
                </div>
            </div>
                        
    );
}
