import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Import social media icons

// Define interfaces for company data and address
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
}

async function fetchCompanyData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/company/getCompany`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

const Headertop: React.FC = async () => {
  const companyData = await fetchCompanyData();

  if (!companyData) {
    return <div>Loading...</div>;
  }

  const formatPhoneNumber = (phone: string | number): string => {
    // Convert number to string if needed
    const phoneStr = phone.toString().trim();

    // Format phone number as XX XXX XXX
    if (phoneStr.length === 8) {
      return `${phoneStr.slice(0, 2)} ${phoneStr.slice(2, 5)} ${phoneStr.slice(
        5
      )}`;
    }
    return phoneStr;
  };

  return (
    <header>
      <div className="w-full h-[50px] justify-center flex bg-[#000000] max-lg:hidden">
        <div className="flex text-white w-[90%] justify-around items-center max-2xl:text-base text-lg">
          <div className="flex gap-6 items-center">
            <p className="flex gap-2 items-center uppercase">
              Address: {companyData.address}, {companyData.zipcode}
              {companyData.addresse?.city}, {companyData.governorate}, Tunisie
            </p>
            <p className="flex gap-2 items-center border-l-2 px-4">
              TELE: +216 {formatPhoneNumber(companyData.phone)}
            </p>
            <p className="flex gap-2 items-center border-l-2 px-4">EMAIL: {companyData.email}</p>
          </div>
          <div className="flex gap-4 items-center border-x-2 px-4">
            {/* Social Media Icons */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-white hover:text-blue-500 transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-white hover:text-blue-400 transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="text-white hover:text-blue-600 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Headertop;
