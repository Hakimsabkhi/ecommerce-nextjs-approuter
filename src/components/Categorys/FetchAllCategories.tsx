"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import LoadingSpinner from "../LoadingSpinner";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
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

interface AddedCategoriesProps {
  categories: Category[];
}

const AddedCategories: React.FC<AddedCategoriesProps> = ({ categories }) => {
  const [addedCategory, setAddedCategory] = useState<Category[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<Category[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const categoriesPerPage = 5; // Number of categories to display per page
  const router =useRouter()
  useEffect(() => {
    // Ensure that categories prop is an array before setting it to state
    if (Array.isArray(categories)) {
      setAddedCategory(categories);
      setFilteredCategory(categories);
    }
    setLoading(false);
  }, [categories]);

  const handleDeleteClick = (category: Category) => {
    setLoadingCategoryId(category._id);
    setSelectedCategory({ id: category._id, name: category.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingCategoryId(null);
  };

  const DeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/category/deleteCategory/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Update state after deletion
      setAddedCategory(addedCategory.filter((cat) => cat._id !== categoryId));
      setFilteredCategory(filteredCategory.filter((cat) => cat._id !== categoryId));
      handleClosePopup();
      toast.success("Category deleted successfully!");
    } catch (err: any) {
      toast.error("Failed to delete category");
    } finally {
      setLoadingCategoryId(null);
    }
  };

  useEffect(() => {
    const filtered = addedCategory.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, addedCategory]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategory.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">All Categories</p>
      
          <button 
          type="button"
          onClick={()=>router.push("/categoryList/addcategory")}
          className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg  h-10 w-[15%]">
            Add a New Category
          </button>
        
      </div>

      <input
        type="text"
        placeholder="Search categories"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />

      <table className="table-auto w-full mt-4 uppercase">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Image URL</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((item, index) => (
            <tr key={index} className="bg-white text-black">
              <td className="border px-4 py-2">
                <Image src={item.logoUrl} width={30} height={30} alt="icon" />
              </td>
              <td className="border px-4 py-2">
                <Link href={item.imageUrl}>
                  {item.imageUrl.split("/").pop()}
                </Link>
              </td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.user?.username}</td>
              <td>
                <div className="flex items-center justify-center gap-2">
                  <Link href={`/admin/categorylist/${item._id}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md">
                      Modify
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                    disabled={loadingCategoryId === item._id}
                  >
                    {loadingCategoryId === item._id ? "Processing..." : "Delete"}
                  </button>
                  {isPopupOpen && selectedCategory.id === item._id && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteCategory}
                      id={selectedCategory.id}
                      name={selectedCategory.name}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCategory.length / categoriesPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AddedCategories;
