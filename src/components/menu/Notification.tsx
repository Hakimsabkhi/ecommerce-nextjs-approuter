"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const [error, setError] = useState<string | null>(null);  // State to track error
  const [notif,setNotif]=useState<number | 0>(0)
  const [notifs, setNotifs] = useState<any[]>([]);
  const [isListVisible, setListVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null); // Ref for wishlist container
  const route=useRouter();
 // Define the function to fetch data
 const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/notification/getnotification'); // API endpoint for notifications
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
     setNotif(data.length);
     setNotifs(data)
   
  } catch (err) {
    // Log the error to the console for debugging
    console.log('Error fetching notifications:', err);
    setError('Failed to load notifications');  // Set error message in state
  } 
};

  
const hendlafficheorder=async (item:any)=>{
  const response = await fetch(`/api/notification/updatenotification/${item._id}`, {
    method: 'PUT',
    

  });
  if(response.ok){
  route.push(`/admin/orderlist/${item.order.ref}`)
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
  const toggleListVisibility = () => {
    setListVisible(prev => !prev);
};
  useEffect(() => {
   

    fetchNotifications(); // Call the fetch function when the component mounts

  }, []);

  return (
    <div ref={listRef} onClick={()=>toggleListVisibility()}className="flex items-center gap-2 text-white cursor-pointer select-none max-xl:hidden ">
      <div className="relative">
   
        <AiOutlineBell size={40} className="text-primary" />
        
          <span className="w-4 h-4 flex justify-center items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
          {notif}
          </span>
       
      </div>
     <ListNotification 
     data={notifs}
     isListVisible={isListVisible}
     hendlafficheorder={hendlafficheorder}
    />
    </div>
  );
};

export default Notification;
