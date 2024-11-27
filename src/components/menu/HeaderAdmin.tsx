// components/menu/Header.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

import LogoComponent from "@/components/menu/LogoComponent";

import UserMenu from "@/components/userComp/UserMenu";

const HeaderAdmin = async () => {
  // Fetch the session on the server-side
  const session = await getServerSession(authOptions);

  return (
    <>
     
      <div className="w-full h-[80px] bg-primary flex justify-center items-center max-lg:justify-around gap-4 border-y border-gray-600">
        <div className="w-[90%] flex justify-between items-center max-lg:justify-around gap-4">
          <LogoComponent />
          <div className="flex">
        
           
            <UserMenu session={session} />
          </div>
        </div>
      </div>
   
    </>
  );
};

export default HeaderAdmin;
