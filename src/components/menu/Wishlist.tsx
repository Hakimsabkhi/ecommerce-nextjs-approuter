import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { Session } from "next-auth";
import Listmywish from "./Listmywish";

interface WishlistProps {
  session: Session | null;
}

async function fetchfavoriteData(id: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/favorite/getFavorite?email=${encodeURIComponent(id)}`,
    {
      method: "GET",
      next: { revalidate: 0 },
    }
  );

  return res.json();
}

const Wishlist: React.FC<WishlistProps> = async ({ session }) => {
  let content;

  if (session) {
    const data = await fetchfavoriteData(session.user.id);
    content = (
      <div >
        
       <Listmywish data={data}/>
      </div>
    );
  } else {
    content = (
      <div className="flex w-[200px] items-center justify-center gap-2 max-lg:w-fit text-white cursor-pointer select-none max-xl:hidden">
        <div className="relative my-auto mx-2">
        <AiOutlineHeart size={40} className="text-white" />
        <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
            0
          </span>
          </div>
        <div className="flex flex-col">
        <div className="flex flex-col">
          <p className="text-[#C1C4D6] text-sm">Favorite</p>
          
        </div>
        </div>
      </div>
    );
  }

  return content;
};

export default Wishlist;
