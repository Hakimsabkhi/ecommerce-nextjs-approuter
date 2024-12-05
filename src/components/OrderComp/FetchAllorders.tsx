"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import { FaSpinner, FaTrashAlt, FaRegEye } from "react-icons/fa";
import Pagination from "../Pagination";
import { useRouter } from "next/navigation";
import { items } from "@/assets/data";

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
  deliveryMethod: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  statusinvoice: boolean;
}

const ListOrders: React.FC = () => {
  const router = useRouter();
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
  const [status, setStatus] = useState(""); // Initial value
  const [timeframe, setTimeframe] = useState<"year" | "month" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isPopupOpeninvoice, setIsPopupOpeninvoice] = useState(false);
  const [selectedorderid, setSelectedorderid] = useState<string>("");
  const [selectedval, setSelectedval] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    console.log(e.target.value); // Do something with the selected value (e.g., filter data)
  };
  const handleDeleteClick = (order: Order) => {
    setLoadingOrderId(order._id);

    setSelectedOrder({ id: order._id, name: order.ref });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingOrderId(null);
  };
  const handleClosePopupinvoice = () => {
    setIsPopupOpeninvoice(false);
    
  };
  const handleinvoice = async (order: string) => {
    try {
      const response = await fetch(`/api/invoice/postinvoice`, {
        method: "POST",

        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      router.push(`/admin/invoice/${data.ref._id}`);
    } catch (error) {
      toast.error("Failed to create invoice");
    }
  };
  const DeleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/order/deleteorderbyid/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleClosePopup();
      toast.success("order delete successfully!");

      await getOrders();
    } catch (err: any) {
      toast.error(`[order_DELETE] ${err.message}`);
    } finally {
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
  const handleinvoiceconfirm=async(orderId: string, newStatus: string)=>{
    
    
    try{
    const updateFormData = new FormData();
    updateFormData.append("vadmin", newStatus);
    const response = await fetch(
      `/api/order/updatestatusinvoice/${orderId}`,
      {
        method: "PUT",
        body: updateFormData,
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    setOrders((prevData) =>
      prevData.map((item) =>
        item._id === orderId
          ? { ...item, statusinvoice: JSON.parse(newStatus) }
          : item
      )
    );
    handleinvoice(orderId);
    const data = await response.json();
    console.log("Order status updated successfully:", data);
  } catch (error) {
    console.error("Failed to update Order status:", error);
    toast.error("Failed to update Order status");
  }
  }
  const updatestatusinvoice = async (orderId: string, newStatus: string) => {
   
    if(newStatus=="false"){
    
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);
      const response = await fetch(
        `/api/order/updatestatusinvoice/${orderId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setOrders((prevData) =>
        prevData.map((item) =>
          item._id === orderId
            ? { ...item, statusinvoice: JSON.parse(newStatus) }
            : item
        )
      );
      const data = await response.json();
      console.log("Order status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update Order status:", error);
      toast.error("Failed to update Order status");
    }
  }else{
    setIsPopupOpeninvoice(true)
    setSelectedorderid(orderId)
    setSelectedval(newStatus)
  }
  };
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
      const matchesSearch =
        order.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = status === "" || order.orderStatus === status;

      // Apply date filtering based on the selected timeframe
      const matchesDateFilter = (date: string) => {
        const orderDate = new Date(order.createdAt);
        const selectedDateObj = new Date(date);

        if (timeframe === "year") {
          return orderDate.getFullYear() === selectedDateObj.getFullYear();
        } else if (timeframe === "month") {
          return (
            orderDate.getFullYear() === selectedDateObj.getFullYear() &&
            orderDate.getMonth() === selectedDateObj.getMonth()
          );
        } else if (timeframe === "day") {
          return (
            orderDate.getFullYear() === selectedDateObj.getFullYear() &&
            orderDate.getMonth() === selectedDateObj.getMonth() &&
            orderDate.getDate() === selectedDateObj.getDate()
          );
        }
        return true; // No filter if no timeframe is selected
      };

      return matchesSearch && matchesStatus && matchesDateFilter(selectedDate);
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page
  }, [searchTerm, status, orders, timeframe, selectedDate]);

  useEffect(() => {
    // Set default selectedDate when the component is mounted
    const currentDate = new Date();
    if (timeframe === "year") {
      setSelectedDate(`${currentDate.getFullYear()}-01-01`);
    } else if (timeframe === "month") {
      setSelectedDate(
        `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-01`
      );
    } else if (timeframe === "day") {
      setSelectedDate(currentDate.toISOString().split("T")[0]); // Current date in YYYY-MM-DD format
    }
  }, [timeframe]);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[90%] py-8 flex flex-col gap-8">
      <div className="flex justify-between">
        <p className="text-3xl font-bold">ALL Orders</p>
        <Link
          href={"orderlist/addorder"}
          className="bg-gray-800 text-white w-1/5  hover:bg-gray-400 rounded-md flex items-center justify-center"
        >
          <button type="button" className="uppercase ">
            create order
          </button>
        </Link>
      </div>
      
      
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-1/5"
        />
        
          <select
            name="category"
            value={status}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-1/5"
            required
          >
            <option value="">All</option>
            <option value="Processing">En cours de traitement</option>
            <option value="Pack">Expédiée</option>
            <option value="Deliver">Livrée</option>
            <option value="Cancelled">Annulée</option>
            <option value="Refunded">Remboursée</option>
          </select>
        
        <div className="flex justify-between w-[500px]">
          <button
            onClick={() => setTimeframe("year")}
            className={`p-2 rounded ${
              timeframe === "year"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-white"
            }`}
          >
            Par Année
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`p-2 rounded ${
              timeframe === "month"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-white"
            }`}
          >
            Par Mois
          </button>
          <button
            onClick={() => setTimeframe("day")}
            className={`p-2 mr-8 rounded ${
              timeframe === "day"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-white"
            }`}
          >
            Par Jour
          </button>
          <input
            type={
              timeframe === "year"
                ? "number"
                : timeframe === "month"
                ? "month"
                : "date"
            }
            className="border rounded p-2 w-44"
            value={
              timeframe === "year"
                ? selectedDate.split("-")[0]
                : timeframe === "month"
                ? selectedDate.slice(0, 7)
                : selectedDate
            }
            onChange={(e) => {
              if (timeframe === "year") {
                setSelectedDate(`${e.target.value}-01-01`);
              } else if (timeframe === "month") {
                setSelectedDate(e.target.value);
              } else {
                setSelectedDate(e.target.value);
              }
            }}
          />
        </div>
      </div>
      <div className="h-80 pt-4">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 w-[12%]">REF</th>
              <th className="px-4 py-3 w-[13%]">Customer Name</th>
              <th className="px-4 py-3 w-[15%]">Total</th>

              <th className="px-4 py-3 w-[15%]">Date</th>
              <th className="px-4 text-center py-3 w-[45%]">Action</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredOrders.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune commande trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentOrders.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white text-black "
                >
                  <td className="border px-4 py-2 uppercase ">
                    {item.ref.slice(0, 10)}...
                  </td>
                  <td className="border px-4 py-2 uppercase">
                    {item.user.username}
                  </td>
                  <td className="border px-4 py-2 text-start">
                    {item.total.toFixed(2)} TND
                  </td>
                  <td className="border px-4 py-2 ">
                    {new Date(item.createdAt).toLocaleDateString("en-GB")} -{" "}
                    {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
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
                        <option value="Processing">En cours</option>
                        <option value="Pack">Expédiée</option>
                        <option value="Deliver">Livrée</option>
                        <option value="Cancelled">Annulée</option>
                        <option value="Refunded">Remboursée</option>
                      </select>
                      <Link href={`/admin/orderlist/${item.ref}`}>
                        <button className="bg-gray-800 text-white p-3 hover:bg-gray-600 rounded-md uppercase">
                          <FaRegEye />
                        </button>
                      </Link>
                      <Link href={`/admin/orderlist/editorder/${item.ref}`}>
                        <button className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase">
                          Edit
                        </button>
                      </Link>
                      <select
                        className={`w-50 text-black rounded-md p-2 ${
                          item.statusinvoice === false
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={item.statusinvoice.toString()}
                        onChange={(e) =>
                          updatestatusinvoice(item._id, e.target.value)
                        }
                      >
                        <option value="true" className="text-white uppercase">
                          approve
                        </option>
                        <option value="false" className="text-white uppercase">
                          Not approve{" "}
                        </option>
                      </select>
                      {item.statusinvoice === false ? (
                        <Link href={`/admin/Bondelivraison/${item.ref}`}>
                          <button className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase">
                            INVOICE
                          </button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleinvoice(item._id)}
                          className="bg-gray-800 text-white w-32 h-10 hover:bg-gray-600 rounded-md uppercase"
                        >
                          Invoice
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={loadingOrderId === item._id}
                      >
                        {loadingOrderId === item._id ? (
                          "Processing..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                      {isPopupOpen && (
                        <DeletePopup
                          handleClosePopup={handleClosePopup}
                          Delete={DeleteOrder}
                          id={selectedOrder.id} // Pass selected user's id
                          name={selectedOrder.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
      {isPopupOpeninvoice && (   <div
      className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75"      
    >
      <div className="absoluteopacity-80 inset-0 z-0 "></div>
      <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        {/* content */}
        <div>
          {/* body */}
          <div className="text-center p-5 flex-auto justify-center">
           
            <svg  className="w-20 h-20 -m-1 flex items-center text-primary mx-auto"
             viewBox="0 0 1024 1024" 
             
  version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M511.64164 924.327835c-228.816869 0-414.989937-186.16283-414.989937-414.989937S282.825796 94.347961 511.64164 94.347961c102.396724 0 200.763434 37.621642 276.975315 105.931176 9.47913 8.499272 10.266498 23.077351 1.755963 32.556481-8.488009 9.501656-23.054826 10.266498-32.556481 1.778489-67.723871-60.721519-155.148319-94.156494-246.174797-94.156494-203.396868 0-368.880285 165.482394-368.880285 368.880285S308.243749 878.218184 511.64164 878.218184c199.164126 0 361.089542-155.779033 368.60998-354.639065 0.49556-12.720751 11.032364-22.863359 23.910794-22.177356 12.720751 0.484298 22.649367 11.190043 22.15483 23.910794-8.465484 223.74966-190.609564 399.015278-414.675604 399.015278z" fill="currentColor" /><path d="M960.926616 327.538868l-65.210232-65.209209-350.956149 350.956149-244.56832-244.566273-65.210233 65.209209 309.745789 309.743741 0.032764-0.031741 0.03174 0.031741z" fill="currentColor" />
</svg>
            <h2 className="text-xl font-bold py-4">Are you sure?</h2>
            <p className="text-sm text-gray-500 px-8">
              Do you really want to Invoice  go to Accounting :
              
            </p>
            

          </div>
          {/* footer */}
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
            onClick={handleClosePopupinvoice}
             className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-primary rounded-full hover:shadow-lg hover:bg-[#15335D] hover:border-[#15335D] hover:text-white">
              Cancel
            </button>
           <button 
           type="button"
           onClick={()=>handleinvoiceconfirm(selectedorderid,selectedval)}
           className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-primary rounded-full hover:shadow-lg hover:bg-[#15335D] hover:border-[#15335D] text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>)}
    </div>
  );
};

export default ListOrders;
