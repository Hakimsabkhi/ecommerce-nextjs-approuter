import React from 'react';
import useSWR from 'swr';

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

// Fetcher function for useSWR
const fetcher = async (url: string): Promise<CompanyData> => {
  const res = await fetch(url, {
    method: 'GET',
    next: { revalidate: 0 }, // Disable caching to always fetch the latest data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch company data');
  }

  return res.json();
};

const Headertop: React.FC = () => {
  // Use useSWR to fetch company data
  const { data: companyData, error } = useSWR('/api/company/getCompany', fetcher);

  if (error) {
    console.error(error);
    return <div>Error loading company data</div>;
  }

  if (!companyData) {
    return <></>;
  }

  return (
    <header>
      <nav className='w-full h-[57px] justify-center flex bg-[#6A6A6A] max-lg:hidden'>
        <div className="flex text-white w-[90%] justify-between items-center max-2xl:text-base text-2xl">                                            
          <p className='flex gap-2 items-center uppercase'>
            Address: {companyData.addresse?.address}, {companyData.addresse?.zipcode} {companyData.addresse?.city}, {companyData.addresse?.governorate}, Tunisie
          </p>                    
          <div className="flex gap-16 items-center ">                                                    
            <p className='flex gap-2 items-center'>TELE: {companyData.phone}</p>                                                                        
            <p className='flex gap-2 items-center'>EMAIL: {companyData.email}</p>                                                            
          </div> 
        </div>
      </nav>
    </header>
  );
};

export default Headertop;
