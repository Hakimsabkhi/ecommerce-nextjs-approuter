"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import DeletePopup from "@/components/Popup/DeletePopup";
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

type Brand = {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
  logoUrl: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

interface User {
  _id: string;
  username: string;
}

const AddedBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const brandsPerPage = 5; // Number of brands to display per page
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState({ id: '', name: '' });
  const [loadingBrandId, setLoadingBrandId] = useState<string | null>(null);

  const handleDeleteClick = (brand: Brand) => {
    setLoadingBrandId(brand._id);
    setSelectedBrand({ id: brand._id, name: brand.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingBrandId(null);
  };

  const deleteBrand = async (brandId: string) => {
    try {
      const response = await fetch(`/api/brand/deleteBrand/${brandId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleClosePopup();
      toast.success("Brand deleted successfully!");
      setBrands(brands.filter((brand) => brand._id !== brandId));
    } catch (err: any) {
      toast.error(`[Brand_DELETE] ${err.message}`);
    } finally {
      setLoadingBrandId(null);
    }
  };

  const getBrands = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/brand/getAllBrandAdmin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Brand[] = await response.json();
      setBrands(data);
    } catch (err: any) {
      setError(`[Brand_GET] ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, brands]);

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='mx-auto w-[90%] py-8 flex flex-col gap-8'>
      <div className="flex items-center justify-between">
        <p className='text-3xl font-bold'>ALL Brands</p>
        <Link href="/admin/brandlist/addbrand" className="w-[15%]">
          <button className='bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-full h-10'>
            Add a new Brand
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search brands"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='mt-4 p-2 border border-gray-300 rounded'
      />

      <table className="table-auto w-full mt-4">
        <thead>
          <tr className='bg-gray-800'>
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">ImageURL</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Place</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBrands.map((item, index) => (
            <tr key={index} className='bg-white text-black'>
              <td className="border px-4 py-2">
                <Image src={item.logoUrl} width={30} height={30} alt="icon" />
              </td>
              <td className="border px-4 py-2">
                <Link href={item.imageUrl}>
                  {item.imageUrl.split('/').pop()}
                </Link>
              </td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border-b px-4 py-2">{item.place}</td>
              <td className="border-b px-4 py-2">{item?.user?.username}</td>
              <td className="border-b flex items-center justify-center gap-2">
                <Link href={`/admin/brandlist/${item._id}`}>
                  <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                    Modify
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                >
                  {loadingBrandId === item._id ? "Processing..." : "DELETE"}
                </button>
                {isPopupOpen && (
                  <DeletePopup
                    handleClosePopup={handleClosePopup}
                    Delete={deleteBrand}
                    id={selectedBrand.id}
                    name={selectedBrand.name}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-center mt-4'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AddedBrands;
