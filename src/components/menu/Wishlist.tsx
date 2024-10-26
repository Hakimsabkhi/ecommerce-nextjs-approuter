import React from "react";
import { AiOutlineHeart } from "react-icons/ai";

const Wishlist = () => {
  return (
    <div className="flex w-[200px] items-center justify-center gap-2 max-lg:w-fit text-white cursor-pointer select-none">
      <div className="relative my-auto mx-2">
        <AiOutlineHeart size={40} className="text-white" />
        <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
          2
        </span>
      </div>
      <div className="flex flex-col">
        <p className="text-[#C1C4D6] text-sm">Favorite</p>
        <p className="text-white font-bold">My Wishlist</p>
      </div>
    </div>
  );
};

export default Wishlist;
