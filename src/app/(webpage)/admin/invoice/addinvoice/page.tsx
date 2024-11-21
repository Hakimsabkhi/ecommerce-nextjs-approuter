"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InvoiceTable from "@/components/invoice/InvoiceTable";

// Item interface
interface Items {
  refproduct: string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  image: string;
  discount: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva: number;
  price: number;
  imageUrl?: string;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  quantity: number;
}

// Invoice and Address interfaces
interface Invoice {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  Items: Items[];
  paymentMethod: string;
  deliveryCost: number;
  total: number;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  phone: number;
}

interface Address {
  _id: string;
  user: User;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

export default function Dashboard() {
  const [itemList, setItemList] = useState<Items[]>([]);
  const [customer, setCustomer] = useState<string>("");
  const [ref, setRef] = useState<string>("");
  const [price, setPrice] = useState<number>(1);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemName, setItemName] = useState<string>("");
  const [itemProduct, setItemProduct] = useState<string>("");
  const [itemTva, setItemTva] = useState<number>();
  const [itemImage, setItemImage] = useState<string>("");
  const [itemDiscount, setItemDiscount] = useState<number>(0);

  const [customers, setCustomers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const router = useRouter();

  // Add item to the invoice
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && price > 0 && itemQuantity >= 1) {
      setItemList([
        ...itemList,
        {
          refproduct: ref,
          product: itemProduct,
          name: itemName,
          tva: itemTva || 0,
          quantity: itemQuantity,
          image: itemImage,
          discount: itemDiscount,
          price: price,
        },
      ]);

      // Reset fields
      setItemName("");
      setPrice(0);
      setItemQuantity(0);
    }
  };

  // Calculate total amount
  const getTotalAmount = () => {
    return itemList.reduce((total, item) => total + item.price, 0);
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle creating the invoice here
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
  setSearchQuery(query);

  // Filter products based on name, ref, price, and tva
  const filtered = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) || // Search by name
      product.ref.toLowerCase().includes(query) || // Search by ref
      product.price.toString().includes(query) || // Search by price
      product.tva.toString().includes(query) // Search by tva
    );
  });

  setFilteredProducts(filtered);
  };

  const handleProductSelect = (product: Product) => {
    setRef(product.ref || "");
    setItemName(product.name || "");
    setItemImage(product.imageUrl || "");
    setItemDiscount(product.discount || 0);
    setItemProduct(product._id || "");
    setItemTva(product.tva || 0);
    setPrice(product.price || 0);
    setItemQuantity(1); // Default quantity
    setSearchQuery(""); // Clear search query after selecting a product
  };

  // Fetch address when customer changes
  useEffect(() => {
    if (!customer) return;
    const fetchAddress = async () => {
      const res = await fetch(`/api/address/getaddresbyid/${customer}`);
      const data = await res.json();
      setAddresses(data);
    };
    fetchAddress();
  }, [customer]);

  // Fetch customers and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [usersResponse, productsResponse] = await Promise.all([
        fetch("/api/users/userdashboard"),
        fetch("/api/products/getAllProduct"),
      ]);

      const usersData = await usersResponse.json();
      const productsData = await productsResponse.json();

      setCustomers(usersData);
      setProducts(productsData);
      setFilteredProducts(productsData); // Initialize filtered products
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <main className="min-h-[90vh] flex items-start">
        <div className="w-full h-full p-6">
          <h2 className="font-bold text-2xl mb-3">Add new invoice</h2>

          <form className="w-full flex flex-col" onSubmit={handleFormSubmit}>
            <div className="flex flex-col-2 gap-2">
              <div className="w-1/2">
                <label htmlFor="customer">Customer</label>
                <select
                  className="border-[1px] p-2 rounded-sm mb-3 w-full"
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option value="" disabled>
                    Select a customer
                  </option>
                  {customers.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label htmlFor="address">Address</label>
                <select
                  className="border-[1px] p-2 rounded-sm mb-3 w-full"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                >
                  <option value="" disabled>
                    Select an address
                  </option>
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {`${addr.address}, ${addr.city}, ${addr.governorate} - ${addr.zipcode}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="w-full flex flex-col mt-4 mb-3">
              <h3 className="font-bold mb-2">Items List</h3>
              {/* Form for adding items */}
              <div className="space-x-3">
                {/* Item search */}
                <div className="w-full">
                  <label htmlFor="search" className="font-bold">
                    Search Product
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for a product..."
                    className="py-2 px-4 bg-gray-100 w-full mt-2"
                  />

                  {/* Show filtered products */}
                  {filteredProducts.length > 0 && searchQuery && (
                    <div className="mt-2 border border-gray-300 rounded-sm max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product._id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleProductSelect(product)}
                        >
                         <div className="flex gap-5"><h1>{product.ref}</h1><h1 className="border border-l-gray-300">{product.name}</h1><h1>{(product.price - product.price * ((product.discount||0) / 100)).toFixed(3) } TND </h1></div><hr/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {/* Inputs for customizing selected product */}
                  <div className="flex flex-col">
                    <h2 className="font-bold">ref :</h2>
                    <input
                      type="text"
                      placeholder="ref"
                      value={ref}
                      onChange={(e) => setRef(e.target.value)}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold">Designation :</h2>
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold">PU BRUT :</h2>
                    <input
                      type="number"
                      placeholder="Prix brut"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold">Tav % :</h2>
                    <input
                      type="number"
                      placeholder="TVA"
                      value={itemTva}
                      onChange={(e) => setItemTva(Number(e.target.value))}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold">rem % :</h2>
                    <input
                      type="number"
                      placeholder="Discount"
                      value={itemDiscount}
                      onChange={(e) => setItemDiscount(Number(e.target.value))}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold">Qte :</h2>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold">Pu Tva :</h2>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={price - (price * (itemDiscount / 100 || 0))}
                      className="py-2 px-4 bg-gray-100"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={itemImage}
                      onChange={(e) => setItemImage(e.target.value)}
                      className="py-2 px-4 bg-gray-100 hidden"
                    />
                    <input
                      type="text"
                      value={itemProduct}
                      onChange={(e) => setItemProduct(e.target.value)}
                      className="py-2 px-4 bg-gray-100 hidden"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddItem}
                  className="bg-gray-400 hover:bg-gray-600 text-white px-4 h-12 rounded mt-2"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Items Table */}
            <InvoiceTable items={itemList} />

            {/* Save Button */}
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white w-full py-4 rounded mt-6"
              type="submit"
            >
              SAVE & PREVIEW INVOICE
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
