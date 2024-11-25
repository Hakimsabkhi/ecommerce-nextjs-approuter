"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import LoadingSpinner from "../LoadingSpinner";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  username: string;
  // other user fields
};

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  paymentMethod: string;
  deliveryMethod:string;
  createdAt:string;
  total: number;
  orderStatus: string;
}

const ListOrders: React.FC = () => {
  const router=useRouter();
  const [orders, setOrders] = useState<Order[]>([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Filtered orders
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 5;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState({ id: "", name: "" });
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState(''); // Initial value

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    console.log(e.target.value); // Do something with the selected value (e.g., filter data)
  };
  const handleDeleteClick = (order:Order) => {

    setLoadingOrderId(order._id); 
    
    setSelectedOrder({ id: order._id, name: order.ref });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingOrderId(null); 
  };
  const handleinvoice=async(order:string)=>{
    try {
     
      const response = await fetch(`/api/invoice/postinvoice`, {
        method: "POST",
       
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data)
      router.push(`/admin/invoice/${data.ref._id}`)

    } catch (error) {
      toast.error("Failed to create invoice");
    } 
  }
  const DeleteOrder = async (id: string) => {
        
    try {
        const response = await fetch(`/api/order/deleteorderbyid/${id}`, {
            method: 'DELETE',
            
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        handleClosePopup();
        toast.success("order delete successfully!" );
       
       
        await getOrders();

    } catch (err: any) {
        
        toast.error(`[order_DELETE] ${err.message}` );
    }finally{
        setLoadingOrderId(null); 
      }
};
  const getOrders = useCallback(async () => {
  
    try {
      const response = await fetch("/api/order/getallorder", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data); // Store all orders
      setFilteredOrders(data); // Initially, filteredOrders are the same as orders
    } catch (err: any) {
      setError(`[Orders_GET] ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(`/api/order/updateStatusorder/${orderId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Order status updated successfully:", data);

      getOrders(); // Refresh the orders
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    // Apply search and status filter
    const filtered = orders.filter((order) => {
      const matchesSearch =order.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.username.toLowerCase().includes(searchTerm.toLowerCase()); 
      const matchesStatus = status === '' || order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page
  }, [searchTerm, status, orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[85%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Orders</p>
      </div>
      <div className="flex justify-end">
        <Link href={"orderlist/addorder"} className="bg-gray-800 text-white w-1/3 p-2 hover:bg-gray-400 rounded-md flex items-center justify-center">
      <button type="button" className="uppercase ">create order</button>
      </Link>
      </div>
      <input
        type="text"
        placeholder="Search orders"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <div className="flex justify-end items-center">
      <select
        name="category"
        value={status}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[20%] block p-2.5"
        required
      >
        <option value="">All</option>
        <option value="Processing">En cours de traitement</option>
        <option value="Pack">Expédiée</option>
        <option value="Deliver">Livrée</option>
        <option value="Cancelled">Annulée</option>
        <option value="Refunded">Remboursée</option>
      </select>
    </div>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">REF</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Delivery Method</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((item) => (
            <tr key={item._id} className="bg-white text-black whitespace-nowrap">
              <td className="border px-4 py-2 uppercase ">{item.ref}</td>
              <td className="border px-4 py-2 uppercase">{item.user.username}</td>
              <td className="border px-4 py-2 text-start">{item.total} TND</td>
              <td className="border px-4 py-2 uppercase">{item.deliveryMethod}</td>
              <td className="border px-4 py-2 uppercase">{item.paymentMethod}</td>
              <td className="border px-4 py-2 ">{new Date(item.createdAt).toLocaleDateString('en-GB')} - {new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  <select
                    className={`w-50 text-black rounded-md p-2 ${
                      item.orderStatus === "Processing"
                        ? "bg-gray-800 text-white"
                        : "bg-red-700 text-white"
                    }`}
                    value={item.orderStatus}
                    onChange={(e) =>
                      updateOrderStatus(item._id, e.target.value)
                    }
                  >
                    <option value="Processing">En cours de traitement</option>
                    <option value="Pack">Expédiée</option>
                    <option value="Deliver">Livrée</option>
                    <option value="Cancelled">Annulée</option>
                    <option value="Refunded">Remboursée</option>
                  </select>
                  <Link href={`/admin/orderlist/${item.ref}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                      View
                    </button>
                  </Link>
                  <Link href={`/admin/orderlist/editorder/${item.ref}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                      Edite
                    </button>
                  </Link>
                  <Link href={`/admin/Bondelivraison/${item.ref}`}>
                    <button className="bg-gray-800 text-white w-40 h-10 hover:bg-gray-600 rounded-md uppercase">
                      Bon de Livraison
                    </button>
                  </Link>
                  <button type="button" onClick={()=>handleinvoice(item._id)}className="bg-gray-800 text-white w-32 h-10 hover:bg-gray-600 rounded-md uppercase">
                      Invoice
                    </button>
                  <button
                  onClick={()=>handleDeleteClick(item)}
                    className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                    disabled={loadingOrderId === item._id}
                  >
                    {loadingOrderId === item._id ? "Processing..." : "DELETE"}
                  </button>
                  {isPopupOpen &&     < DeletePopup  handleClosePopup={handleClosePopup} Delete={DeleteOrder}  id={selectedOrder.id} // Pass selected user's id
                    name={selectedOrder.name} />}      
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListOrders;
