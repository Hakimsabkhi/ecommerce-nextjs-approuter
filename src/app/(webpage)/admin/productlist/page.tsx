"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";

type User = {
  _id: string;
  username: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl: string;
  category:Category;
  stock: number;
  user: User;
  discount: number;
  status: string;
  statuspage: string;
  createdAt: Date;
  updatedAt: Date;
};
interface Category{
  _id:string;
  name:string;
}
function slugifyCategoryName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim(); // Remove any special characters
}
const AddedProducts: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 5;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({ id: "", name: "" });
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleDeleteClick = (product: Product) => {
    setLoadingProductId(product._id);
    setSelectedProduct({ id: product._id, name: product.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingProductId(null);
  };

 

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/deleteProduct/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }
      
      setCurrentPage(1);
      setProducts(
        products.filter((Product) => Product._id !== productId)
      );
      toast.success(`Product ${selectedProduct.name} deleted successfully!`);
      handleClosePopup();

    } catch (err: any) {
      toast.error(`Failed to delete product: ${err.message}`);
    } finally {
      setLoadingProductId(null);
    }
  };

  const updateProductStatus = async (productId: string, newStatus: string) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(`/api/products/updateStatusProduct/${productId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Product status updated successfully:", data);
    
    } catch (error) {
      console.error("Failed to update product status:", error);
      toast.error("Failed to update product status");
    } finally {
      setLoadingProductId(null);
    }
  };

  const updateProductStatusPlace = async (productId: string, statuspage: string) => {
    setLoadingProductId(productId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("statuspage", statuspage);

      const response = await fetch(`/api/products/updatePlaceProduct/${productId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Product status page updated successfully:", data);
    
      toast.success("Product status updated successfully");
    } catch (error) {
      console.error("Failed to update product status page:", error);
      toast.error("Failed to update product status");
    } finally {
      setLoadingProductId(null);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
        try {
          const response = await fetch("/api/products/getAllProduct", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          const data: Product[] = await response.json();
          setProducts(data);
          
        } catch (err: any) {
          setError(`[products_GET] ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      getProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ref.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Products</p>
        <Link href="/admin/productlist/addproduct">
          <button className="bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-[200px] h-10">
            <p>Add the new Product</p>
          </button>
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <table className="table-auto w-full mt-4">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">REF</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">ImageURL</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((item) => (
            <tr key={item._id} className="bg-white text-black">
              <td className="border px-4 py-2">{item.ref}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2"><Link href={item.imageUrl}>{item.imageUrl.split('/').pop()}</Link></td>
              <td className="border px-4 py-2">{item.user.username}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  <select
                    className={`w-50 text-black rounded-md p-2 ${item.status === "in-stock" ? "bg-gray-800 text-white" : "bg-red-700 text-white"}`}
                    value={item.status}
                    onChange={(e) => updateProductStatus(item._id, e.target.value)}
                  >
                    <option value="in-stock" className="text-white">In stock</option>
                    <option value="out-of-stock" className="text-white">Out of stock</option>
                  </select>
                  <select
                    className={`w-50 text-black rounded-md p-2 ${item.statuspage === "" ? "bg-gray-800 text-white" : "bg-emerald-950 text-white"}`}
                    value={item.statuspage || ""}
                    onChange={(e) => updateProductStatusPlace(item._id, e.target.value)}
                    disabled={loadingProductId === item._id}
                  >
                    <option value="">Select a Place</option>
                    <option value="home-page">Home Page</option>
                    <option value="best-collection">Best Collection</option>
                    <option value="promotion">Promotion</option>
                  </select>
                  <Link href={`/admin/productlist/${item._id}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">Modify</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                    disabled={loadingProductId === item._id}
                  >
                    {loadingProductId === item._id ? "Processing..." : "DELETE"}
                  </button>
                  <Link href={`/${encodeURIComponent(slugifyCategoryName(item.category.name))}/${item._id}`}>
                    <button className="bg-gray-800 text-white w-36 h-10 hover:bg-gray-600 rounded-md uppercase">See Product</button>
                  </Link>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={deleteProduct}
                      id={selectedProduct.id}
                      name={selectedProduct.name}
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
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AddedProducts;