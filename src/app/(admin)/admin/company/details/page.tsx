"use client"
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


function CreateCompany() {
  const [loading, setLoading] = useState(true);
  const [idCompany,setIdCompany]=useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreviewBanner, setIconPreviewBanner] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const router=useRouter(); 
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file); // Correct state variable for banner
      setIconPreviewBanner(URL.createObjectURL(file));
    }
  };
  const fetchCompanyData =  async () => {
    try {
      const response = await fetch(`/api/company/getCompany`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching company data');
      }
      
      const data = await response.json();
      setCompanyData(data);
      setIdCompany(data._id || '');
      setName(data.name || '');
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setAddress(data.address || '');
      setCity(data.city || '');
      setZipcode(data.zipcode || '');
      setGovernorate(data.governorate || '');
      setFacebook(data.facebook || '');
      setLinkedin(data.linkedin || '');
      setInstagram(data.instagram || '');
      if (data.logoUrl) {
        setIconPreview(data.logoUrl);
      }
      if (data.imageUrl) {
        setIconPreviewBanner(data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    // Fetch company data
   

    fetchCompanyData();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('zipcode', zipcode);
    formData.append('governorate', governorate);
    formData.append('facebook', facebook || '');
    formData.append('linkedin', linkedin || '');
    formData.append('instagram', instagram || '');

    if (iconFile) {
      formData.append('image', iconFile);
    }
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    try {
      const response = await fetch('/api/company/postCompany', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add company');
      }

      const data = await response.json();
      fetchCompanyData();
      router.push("/admin/company");
      console.log('Company added successfully:', data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleUpadte = async (e: React.FormEvent) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('id', idCompany);

    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('zipcode', zipcode);
    formData.append('governorate', governorate);
    formData.append('facebook', facebook || '');
    formData.append('linkedin', linkedin || '');
    formData.append('instagram', instagram || '');

    if (iconFile) {
      formData.append('image', iconFile);
    }
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    try {
      const response = await fetch('/api/company/updateCompany', {
        method: 'put',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add company');
      }

      const data = await response.json();
      fetchCompanyData();
      router.push("/admin/company");
      console.log('Company added successfully:', data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 gap-8">
      <p className="text-3xl font-bold">Company Details</p>
      <form  onSubmit={companyData ? handleUpadte : handleSubmit}  className="mb-4 mt-4">
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 '>
          <div className="mb-4">
            <p className="block text-sm font-medium">Name Company*</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Phone*</p>
            <input
              type="number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only numbers and limit the length to 10
                if (/^\d*$/.test(value) && value.length <= 8) {
                  setPhone(value);
                }
              }}
              maxLength={8} 
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Email*</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Address*</p>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">City*</p>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">ZipCode*</p>
            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Governorate*</p>
            <input
              type="text"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Upload Icon SVG*</p>
            <input
              type="file"
              accept="image/svg"
              onChange={handleIconChange}
              className="hidden"
              id="upload-icon"
            />
            <label
              htmlFor="upload-icon"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            >
              Select an Icon
            </label>
            {iconPreview && (
              <div className="w-[15%] max-lg:w-full">
                <Image
                  src={iconPreview}
                  alt="Icon preview"
                  className="w-full h-auto mt-4"
                  width={50}
                  height={50}
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Upload Banner*</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
              id="upload-banner" // Changed the ID for the banner
            />
            <label
              htmlFor="upload-banner" // Corrected to reference the banner input
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            >
              Select a Banner
            </label>
            {iconPreviewBanner && (
              <div className="w-[15%] max-lg:w-full">
                <Image
                  src={iconPreviewBanner}
                  alt="Banner preview"
                  className="w-full h-auto mt-4"
                  width={50}
                  height={50}
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">Facebook</p>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="mb-4">
            <p className="block text-sm font-medium">LinkedIn</p>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="mb-4">
        <p className="block text-sm font-medium">Instagram</p>
        <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
       
        <div className="flex justify-center items-center gap-4">
     
      <button
            type="button"
            className="bg-gray-400 text-white hover:bg-gray-600 rounded-md w-[30%] h-10"
          >
             <Link href={"/admin/company"}>
            <p className="text-white"> Cancel</p>
            </Link>
          </button>
          
          <button
            type="submit"
            className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-[30%] h-10"
          >
            <p className="text-white">  {companyData ? 'Update Company' : 'Create Company'}</p>
          </button>
         
        </div>
      </form>
    </div>
  );
}

export default CreateCompany;
