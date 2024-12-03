"use client";

import React, { useEffect, useRef } from 'react';


interface ListNotificationProps {
    data: any[];
    isListVisible: boolean;
    hendlafficheorder(item:any):void;

  }






  const ListNotification: React.FC<ListNotificationProps> = ({
    data,
    isListVisible,
    hendlafficheorder,
  }) => {
    
 

    return (
        <div>
      
          
            {/* Render the wishlist items based on visibility */}
            {isListVisible && (
  <div  className="absolute flex flex-col mt-6 w-[400px] max-md:w-[350px] max-h-64 overflow-y-auto
                               border-[#15335D] border-4 rounded-lg bg-white z-30 right-52">
    {data.length > 0 ? (
      <div>
        <h1 className="text-lg font-bold text-black border-b-2 text-center py-2 max-md:text-sm">
          New order
        </h1>
        {data.map((item: any) => (
          <div key={item._id} className="py-2 max-md:mx-[10%] border-b-2">
            <div
            
             onClick={()=>hendlafficheorder(item)}
              className="flex justify-around items-center text-gray-700"
            >
             
              <span>{item.order.ref}</span>
              <span >
                {item.order.user.username}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center py-2">No orders New .</p> // Always show this message
    )}
  </div>
)}

        </div>
    );
};

export default ListNotification;
