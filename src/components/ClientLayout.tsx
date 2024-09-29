"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Footer from "@/components/menu/Footer";
import Header from "./menu/Header";
import Headertop from "./menu/Headertop";
import HeaderBottom from "./menu/Headerbottom";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { data: session } = useSession(); // Fetch session using useSession hook
  const pathname = usePathname();

  const excludedPaths = ["/signup", "/signin", "/checkout"];

  if (excludedPaths.includes(pathname)) {
    return <>{children}</>;
  }
  

  return (
    <div className=" flex flex-col min-h-screen">
      <Headertop />
      <Header/>
      <HeaderBottom />
      <div className="flex-grow">
      {children}
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
