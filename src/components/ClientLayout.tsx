import React from "react";
import Footer from "@/components/menu/Footer";
import Header from "./menu/Header";
import Headertop from "./menu/Headertop";
import HeaderBottom from "./menu/Headerbottom";

interface ClientLayoutProps {
  children: React.ReactNode;
  pathname: string; // Receive pathname from the parent component
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, pathname }) => {
  // Define excluded paths as before
  const excludedPaths = ["/signup", "/signin", "/checkout"];

  if (excludedPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Headertop />
      <Header />
      <HeaderBottom />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
