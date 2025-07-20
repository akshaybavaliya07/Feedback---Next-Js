"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@react-email/components";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer mb-4 md:mb-0">
          Ghost Whisper
        </h1>
        {session ? (
          <>
            <span className="text-lg font-semibold">Welcome, {user?.username}</span>
            <Button
              onClick={() => {
                signOut();
              }}
              className="w-full md:w-auto bg-slate-100 text-black rounded-lg px-4 py-2 transition-all duration-300 cursor-pointer"
            > 
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <button className="w-full md:w-auto bg-slate-100 text-black rounded-lg px-4 py-2 transition-all duration-300 cursor-pointer">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
