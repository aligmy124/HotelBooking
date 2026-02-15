"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlignJustify } from "@deemlol/next-icons";
import { useState } from "react";
import { useAuth } from "../_Context/Authentication";
import userName from "./../../assets/images/Username.png"
import Image from "next/image";
import {useRouter} from "next/navigation"
export default function Navbar() {
  const pathname = usePathname();
  const router=useRouter();
  const [openBar, setOpenBar] = useState(false);
  const [userBar, setUserBar] = useState(false);
  const { isLogin, logout } = useAuth();
  const isActive = (path: string) =>
    pathname === path
      ? "text-[#3252DF] font-semibold border-b-2 border-[#3252DF]"
      : "text-[#152c5b] hover:text-[#3252DF]";

  return (
    <nav className="sticky top-0 left-0 shadow-sm bg-white z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <span className="text-[#3252DF]">Stay</span>cation
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 relative">
            <Link href="/" className={isActive("/")}>
              Home
            </Link>
            <Link href="/User/Links/Explore" className={isActive("/User/Links/Explore")}>
              Explore
            </Link>

            {!isLogin && (
              <>
                <Link href="/Auth/Register" className="px-4 py-2 text-white rounded-lg bg-[#3252Df]">
                  Register
                </Link>
                <Link href="/Auth/Login"  className="px-4 py-2 text-white rounded-lg bg-[#3252DF]">
                  Login
                </Link>
              </>
            )}

            {isLogin && (
              <>
                <Link href="/User/Links/Favorite" className={isActive("/User/Links/Favorite")}>
                  Favorites
                </Link>
                {/* User Dropdown */}
                <div className="relative">
                  <Image src={userName} alt="avater" width={50} height={50} className="rounded-full cursor-pointer w-8" onClick={() => setUserBar(!userBar)}/>
                  {userBar && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md flex flex-col gap-2 p-2">
                      <Link href={`/User/Links/Profile/${isLogin._id}`} className="text-left px-2 py-1 hover:bg-gray-100 rounded">Profile</Link>
                      <Link href={"/User/Booking"} className="text-left px-2 py-1 hover:bg-gray-100 rounded">My Booking</Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserBar(false);
                        }}
                        className="text-left px-2 py-1 text-red-500 hover:bg-gray-100 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-[#3252DF]"
            onClick={() => setOpenBar(!openBar)}
          >
            <AlignJustify size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${openBar ? "max-h-screen py-4" : "max-h-0 overflow-hidden"}`}>
          <div className="flex flex-col gap-3">
            <Link href="/" className={isActive("/")} onClick={() => setOpenBar(false)}>
              Home
            </Link>
            <Link href="/User/Links/Explore" className={isActive("/User/Links/Explore")} onClick={() => setOpenBar(false)}>
              Explore
            </Link>

            {!isLogin && (
              <>
                <Link href="/Auth/Register" className="px-4 py-2 text-white rounded-lg bg-[#3252Df]" onClick={() => setOpenBar(false)}>
                  Register
                </Link>
                <Link href="/Auth/Login" className="px-4 py-2 text-white rounded-lg bg-[#3252Df]" onClick={() => setOpenBar(false)}>
                  Login
                </Link>
              </>
            )}

            {isLogin && (
              <>
                <Link href="/User/Links/Favorite" className={isActive("/User/Links/Favorite")} onClick={() => setOpenBar(false)}>
                  Favorites
                </Link>
                {/* User options */}
                <div className="flex flex-col gap-2 mt-2 border-t pt-2">
                  <Link href={`/User/Links/Profile/${isLogin._id}`} onClick={() => setOpenBar(false)} className="text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Profile
                  </Link>
                  <Link href={'/User/Booking'} onClick={() => setOpenBar(false)} className="text-left px-2 py-1 hover:bg-gray-100 rounded">
                    My Booking
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpenBar(false);
                    }}
                    className="text-left px-2 py-1 text-red-500 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
