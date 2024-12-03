"use client";
import React from "react";
import { AiOutlineBell } from "react-icons/ai";



const Notification: React.FC= () => {
  return (
    <div className="flex items-center gap-2 text-white cursor-pointer select-none max-xl:hidden">
      <div className="relative">
        <AiOutlineBell size={40} className="text-white" />
        
          <span className="w-4 h-4 flex justify-center items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
           0
          </span>
       
      </div>
     
    </div>
  );
};

export default Notification;
