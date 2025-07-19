"use client";

import { useSession, signOut} from "next-auth/react";
import { Button } from "@react-email/components";
import React from "react";

const Navbar = () => {
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer mb-4 md:mb-0">
          True Feedback
        </h1>
        <Button onClick={() => {signOut()}} className="w-full md:w-auto bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
