"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrderTable from "@/components/OrderComp/OrderTable";
import OrderAddress from "@/components/OrderComp/OrderAddress";


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

// order and Address interfaces
interface order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  Items: Items[];
  paymentMethod: string;
  deliveryCost: number;
  statustimbre:boolean;
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
  const [price, setPrice] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const [itemName, setItemName] = useState<string>("");
  const [itemProduct, setItemProduct] = useState<string>("");
  const [itemTva, setItemTva] = useState<number>();
  const [itemImage, setItemImage] = useState<string>("");
  const [itemDiscount, setItemDiscount] = useState<number>(0);
    const[Deliverymethod,setDeliverymethod]=useState<string>("");
    const [costs, setCost] = useState<number>(0);
  const [customers, setCustomers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<string>("");
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    governorate: "",
    city: "",
    zipcode: "",
    address: "",
  });
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [OpenCustomer,setOpenCustomer]=useState<boolean>(false);
  const [isOn, setIsOn] = useState(false);

  // Toggle state on click
  const handleToggle = () => setIsOn(!isOn);
  const handleSearchCustomers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  
    // Filter the customers based on the query (search by username or other customer properties)
    const filteredCustomers = customers.filter((cust) =>
      cust.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOpenCustomer(true);
    setFilteredCustomers(filteredCustomers); // Update the filtered customer list
  };
  const handleCustomerSelect = (customerId: string, username: string) => {
    setOpenCustomer(false);
    setCustomer(customerId); // Set the selected customer ID
    setSearchTerm(username);  // Set the search term to the selected username
  };
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const router = useRouter();

  // Add item to the order
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (itemName.trim() && price > 0 && itemQuantity >= 1) {
      // Check if the item already exists based on the refproduct (or _id)
      const existingItemIndex = itemList.findIndex(item => item.refproduct === ref);
  
      if (existingItemIndex !== -1) {
        // If the item exists, update the quantity
        const updatedItemList = [...itemList];
        updatedItemList[existingItemIndex].quantity += itemQuantity;
  
        setItemList(updatedItemList);
      } else {
        // If the item doesn't exist, add a new one
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
      }
  
      // Reset fields
      setItemName("");
      setPrice(0);
      setItemDiscount(0);
      setRef("");
      setItemTva(0);
      setItemQuantity(0);
    }
  };
  
  // Calculate total amount
  const calculateTotal = (items: Items[], deliveryCost: number, isOn: boolean): number => {
    // Calculate total items cost after applying the discount
    const totalItemsCost = items.reduce((total, item) => {
      const discountedPrice = item.price - (item.price * (item.discount / 100)); // Apply discount
      return total + discountedPrice * item.quantity;
    }, 0);
  
    // Calculate total
    let total = totalItemsCost + deliveryCost;
  
    // If isOn is true, add 1 to the total
    if (isOn) {
      total += 1;
    }
  
    return total;
  };
  
  
  
  const handleDeleteItem = (ref: string) => {
    // Filter out the item based on refproduct (or _id)
    const updatedItemList = itemList.filter(item => item.refproduct !== ref);
    
    // Update the itemList state with the new list
    setItemList(updatedItemList);
  };
  
  const handlecloseAddress=()=>{
   
   setShowNewAddressModal(false);
    setNewAddress({
      governorate: "",
      city: "",
      zipcode: "",
      address: "",
    });

  }
const handleAddNewAddress = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  
  // Append fields from newAddress and customer to FormData
  Object.keys(newAddress).forEach((key) => {
    // Type guard to make sure `key` is a valid key of `newAddress`
    if (key in newAddress) {
      formData.append(key, newAddress[key as keyof typeof newAddress]); // Explicitly cast key type
    }
  });
  formData.append("userId", customer); // Append userId

  try {
    const res = await fetch(`/api/address/postaddressbyuser`, {
      method: "POST",
      body: formData, // Send FormData as the request body
    });

    if (res.ok) {
      const {address} = await res.json();
      const addedAddress =address;
      console.log(addedAddress)
      setAddresses((prev) => [...prev, addedAddress]); // Update address list
      setNewAddress({
        governorate: "",
        city: "",
        zipcode: "",
        address: "",
      });
      setShowNewAddressModal(false); // Close modal
    } else {
      console.error("Failed to add address");
    }
  } catch (err) {
    console.error("Error adding address:", err);
  }
};





  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle creating the order here
 /*    console.log(itemList)
    console.log(calculateTotal(itemList,costs))
    console.log(Deliverymethod)
    console.log(costs)
    console.log(customer);
   console.log(address);
   console.log(paymentMethod); */
   const orderData = {
    itemList: itemList,
    totalCost: calculateTotal(itemList, costs,isOn),
    deliveryMethod: Deliverymethod,
    customer: customer,
    address: address,
    deliveryCost:costs,
    statustimbre:isOn,
    paymentMethod: paymentMethod,
  };
  console.log(orderData); 
  try {
    // Send POST request to API
    const response = await fetch('/api/order/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      // Handle success
      const data = await response.json();
      
      router.push(`/admin/Bondelivraison/${data.ref}`)

    } else {
      // Handle error
      console.error('Failed to create order', response.statusText);
    }
  } catch (error) {
    // Handle network error
    console.error('Error submitting order:', error);
  }
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
   // Handle delivery method change
   const handleDeliveryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMethodId = e.target.value;
    setDeliverymethod(selectedMethodId);

    // Find the selected method and update the cost
    const selectedMethod = deliveryMethods.find(
      (method) => method.id === selectedMethodId
    );
    if (selectedMethod) {
      setCost(selectedMethod.cost);
    }
  };
  const deliveryMethods = [
    {id: "store", label: "Boutique", cost: 0 },
    { id: "fedex", label: "FedEx", cost: 0 },
    { id: "dhl", label: "Fast delivery DHL", cost: 15 },
    { id: "express", label: "Express delivery", cost: 49 },
  ];

  // Fetch address when customer changes
  useEffect(() => {

    const fetchAddress = async () => {
      const res = await fetch(`/api/address/getaddressbyid/${customer}`);
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
          <h2 className="font-bold text-2xl mb-3">Add new order</h2>

          <form className="w-full flex flex-col" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 justify-center  gap-2">
              <div className="w-full">
                <label htmlFor="customer">Customer</label>
                <div className="relative">
                  <input
                    id="customer"
                    type="text"
                      className=" p-2 border  rounded-sm mb-3 w-full"
                    placeholder="Search customer by name"
                    value={searchTerm}
                    onChange={handleSearchCustomers} // Call this on input change
                  />
                  <ul className="absolute top-full mt-1 w-full bg-white  rounded-md shadow-md max-h-60 overflow-auto">
                    {OpenCustomer && filteredCustomers.map((cust) => (
                      <li
                        key={cust._id}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleCustomerSelect(cust._id, cust.username)}
                      >
                        {cust.username}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-full">
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
                <button
    type="button"
    onClick={() => setShowNewAddressModal(true)}
    className="text-blue-600 underline"
  >
    Add New Address
  </button>


              </div>
                {/* Delivery Method */}
              <div className="w-full">
                <label htmlFor="deliveryMethod">Mode de livraison</label>
                <select
                  className="border-[1px] p-2 rounded-sm mb-3 w-full"
                  required
                  value={Deliverymethod}
                  onChange={handleDeliveryChange}
                >
                  <option value="" disabled>
                    Select Mode de livraison
                  </option>
                  {deliveryMethods.map((method) => (
                    <option key={method.id} value={method.id} >
                     {method.label}-{method.cost === 0 ? "free" : `${method.cost} DT`}
                    </option>
                  ))}
                </select>
              </div>
           {/* Payment Method */}
           <div className="w-full">
                <label htmlFor="paymentMethod">Mode de Payment</label>
                <select
                  className="border-[1px] p-2 rounded-sm mb-3 w-full"
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="" disabled>
                    Select Mode de Payment
                  </option>
                  <option value="virement">Virement</option>
                  <option value="carte">Carte Bancaire</option>
                  <option value="onDelivery">Payment on Delivery</option>
                  <option value="express">Paiement Express</option>
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="paymentMethod">Timbre Fiscale</label>
              
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        {/* Label text */}
        <span className="mr-3 text-gray-700">{isOn ? 'On' : 'Off'}</span>

        {/* Toggle container */}
        <div
          onClick={handleToggle}
          className={`relative inline-block w-12 h-6 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          {/* Circle inside the toggle */}
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isOn ? 'transform translate-x-6' : ''}`}
          ></div>
        </div>
      </label>
    
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
                         <div className="flex gap-5 justify-between items-center m-2 text-xl"><h1>{product.ref}</h1><h1>{product.name}</h1><h1>{product.price.toFixed(3)} TND</h1><h1>{product.discount||0}%</h1><h1>{(product.price - product.price * ((product.discount||0) / 100)).toFixed(3) } TND </h1></div><hr/>
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
                <div className="flex justify-end mt-2 ">
                <button
                  onClick={handleAddItem}
                  className="bg-gray-400 w-1/2 hover:bg-gray-600 text-white px-4 h-12 rounded mt-2"
                >
                  Add Item
                </button>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <OrderTable items={itemList}handleDeleteItem={handleDeleteItem} calculateTotal={calculateTotal} costs={costs} isOn={isOn} />

            {/* Save Button */}
            <button
              className="bg-gray-800 hover:bg-gray-600 text-white w-full py-4 rounded mt-6"
              type="submit"
            >
              SAVE & PREVIEW ORDER
            </button>
          </form>

          {/* showNewAddressModal*/} 
      <OrderAddress showNewAddressModal={showNewAddressModal} handleAddNewAddress={handleAddNewAddress} handlecloseAddress={handlecloseAddress} setNewAddress={setNewAddress} newAddress={newAddress} />
        </div>
      </main>
    </div>
  );
}
