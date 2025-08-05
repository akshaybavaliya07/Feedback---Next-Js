"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@react-email/components";
import React from "react";
import Link from "next/link";
import { Ghost } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="p-4 md:p-6 min-h-[10vh] shadow-md bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#1e293b] text-slate-100">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          <Ghost className="w-7 h-7 text-yellow-300 transform -scale-x-100" />
          <h1 className="text-2xl font-bold tracking-wider cursor-pointer mb-4 md:mb-0">
            Ghost Whisper
          </h1>
        </div>
        {session?.user ? (
          <>
            <span className="text-lg font-semibold -ml-20">
              Welcome, {user?.username}
            </span>
            <Link href="/dashboard" className="text-lg font-semibold -ml-20">
              Dashboard
            </Link>
            <Button
              onClick={() => {
                signOut();
              }}
              className="w-full md:w-auto bg-yellow-300 hover:bg-yellow-400 text-black rounded-lg px-4 py-2 transition-all duration-300 cursor-pointer"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <button className="w-full md:w-auto bg-yellow-300 hover:bg-yellow-400 text-black rounded-lg px-4 py-2 transition-all duration-300 cursor-pointer">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
