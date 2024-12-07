"use client";

import React, { useEffect, useMemo } from 'react';
import Pagination from '../Pagination';
import { Dispatch } from '@reduxjs/toolkit';


interface ListNotificationProps {
    data: any[];
    isListVisible: boolean;
    hendlafficheorder(item:any):void;
    currentPage:number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  }


  const timeAgo = (date: string): string => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
  
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);
  
    if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };



  const ListNotification: React.FC<ListNotificationProps> = ({
    data,
    currentPage,
    setCurrentPage,
    isListVisible,
    hendlafficheorder,
  }) => {
    const dataPerPage = 4;
  const totalPages = useMemo(() => Math.ceil(data.length / dataPerPage), [data.length]);

  const paginateddata = useMemo(() => {
    return data.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
  }, [data, currentPage, dataPerPage]);

  // Ensure that the current page is within bounds when data change
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (data.length === 0) {
    return null;
  }

 
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
        <div className="py-2 text-gray-500 border-b-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
        {paginateddata.map((item: any) => (
          <div key={item._id} className="py-2 max-md:mx-[10%] border-b-2">
            <div
            
             onClick={()=>hendlafficheorder(item)}
              className="flex justify-around items-center text-gray-700"
            >
             
              <span>{item.order.ref}</span>
              <span className='flex flex-col'>
               
                <span className='text-sm'> {item.order.user.username}</span>
                <span className='text-[10px] flex justify-end'>{timeAgo(item.order.createdAt)}</span>
                
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
