

import React from "react";
import Image from "next/image";

import Link from "next/link";
import HaderafteFirst from "./HaderafteFirst";

interface CompanyData {

  logoUrl:string
}
async function fetchCompanyData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company/getCompany`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  if (!res.ok) {
      throw new Error('Failed to fetch data');
  }
  return res.json();
}


const Header: React.FC = async() => {
  const companyData = await fetchCompanyData();
  return (
    
      <div className="flex w-[80%] gap-4 items-center justify-around">
        <Link href="/" aria-label="Home page">
          <div>
            <Image
              width={250}
              height={250}
              className="h-auto lg:w-[400px] xl:w-[300px] rounded-[5px] max-lg:hidden"
              src={companyData?.logoUrl}
              alt="Luxe Home logo"
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <HaderafteFirst/>
       
      </div>
  
  );
};

export default Header;
