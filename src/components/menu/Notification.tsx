"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import ListNotification from "./listNotification";
import { useRouter } from "next/navigation";
interface User {
  username: string;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
}

interface Notification {
  _id: string;
  order: Order;
  seen: string;
  createdAt: string;
  updatedAt: string;
}


const Notification: React.FC= () => {
   // State to track loading status
 
  const [notif,setNotif]=useState<number | 0>(0)
  const [notifs, setNotifs] = useState<any[]>([]);
  const [isListVisible, setListVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null); // Ref for wishlist container
  const route=useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  
 // Define the function to fetch data
 const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/notification/getnotification'); // API endpoint for notifications
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
    const Nnotif = data.filter((notification: { look: string; }) => notification.look && notification.look === 'false').length;
    //console.log(Nnotif)
     setNotif(Nnotif);
     setNotifs(data)
   
  } catch (err) {
    // Log the error to the console for debugging
    console.log('Error fetching notifications:', err);
   
  } 
};

  
const hendlafficheorder=async (item:any)=>{
  const response = await fetch(`/api/notification/updatenotification/${item._id}`, {
    method: 'PUT',
    

  });
  if(response.ok){
  route.push(`/admin/orderlist/${item.order.ref}`)
  setListVisible(false);
  fetchNotifications();
  }else{
    console.log('eurr notification')
  }
}
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (listRef.current && !listRef.current.contains(event.target as Node)) {
              setListVisible(false);
          }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);
  const toggleListVisibility = async (data:any[]) => {
    setListVisible(prev => !prev);  
    const response = await fetch(`/api/notification/updatenotifications/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if(response.ok){
      
      fetchNotifications();
    }else{
      console.log('eurr notification')
    }
   
};

  useEffect(() => {
   

    fetchNotifications(); // Call the fetch function when the component mounts
    const interval = setInterval(fetchNotifications, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={listRef}   className="flex items-center gap-2 text-white cursor-pointer select-none max-xl:hidden ">
      <div className="relative" onClick={()=>toggleListVisibility(notifs)}>
   
        <AiOutlineBell size={40} className="text-primary" />
        
          <span className="w-4 h-4 flex justify-center items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
          {notif}
          </span>
       
      </div>
     <ListNotification 
        data={notifs}
        isListVisible={isListVisible}
        hendlafficheorder={hendlafficheorder} currentPage={currentPage} setCurrentPage={setCurrentPage}    />
    </div>
  );
};

export default Notification;
