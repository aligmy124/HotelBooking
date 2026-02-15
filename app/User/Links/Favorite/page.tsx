"use client";
import { PORTAL_FAVOURITE_ENDPOINTS } from "@/app/_Api/Api";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../../../assets/images/pic (2).png";
import Link from "next/link";
interface favoriteProps {
  _id: string;
  rooms: Room[];
}
interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: string[];
  createdBy: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
export default function page() {
  const [getFavorite, setGetFavorite] = useState<favoriteProps[]>([]);
  const [loading, setLoading] = useState(true);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  // useeffect
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) getFavorites(storedToken, 1); // ارسل التوكن
  }, []);

  const getFavorites = async (token: string | null, page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(PORTAL_FAVOURITE_ENDPOINTS.getFavourite, {
        headers: {
          Authorization: `${token}`,
        },
        params: { page, size: pageSize },
      });
      console.log(res.data.data.favoriteRooms);
      setGetFavorite(res.data.data.favoriteRooms);
      const totalcount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalcount / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <div className="text-sm flex gap-2 text-gray-400 mb-y">
        <Link href="/" className="hover:text-[#152C5B]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#152C5B] font-semibold">Favorites</span>
      </div>
      {/* Title */}
      <div className="text-center mb-5">
        <h1 className="text-4xl font-semibold text-[#152C5B]">
          Your Favorites
        </h1>
      </div>
      <div className="mb-5">
        <h2 className="font-medium text-2xl text-[#152C5B]">Your Rooms</h2>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div
              key={i}
              className="h-64 w-full rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {getFavorite
              .flatMap((fav) => fav.rooms)
              .map((room) => (
                <div
                  key={room._id}
                  className="relative overflow-hidden rounded-2xl shadow-lg group"
                >
                  {room.images.length > 0 ? (
                    <Image
                      src={room.images[0] || ""}
                      alt={room.roomNumber || ""}
                      width={400}
                      height={250}
                      className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Overlay يظهر عند Hover */}
                  <div className="absolute left-2 bottom-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                    <h3 className="text-xl font-semibold">{room.roomNumber}</h3>
                  </div>
                </div>
              ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-1">
                {/* Prev */}
                {currentPage > 1 && (
                  <button
                    onClick={() => getFavorites(token, currentPage - 1)}
                    className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
                  >
                    Prev
                  </button>
                )}

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => getFavorites(token, page)}
                      className={`min-w-9 rounded-full py-2 px-3.5 text-sm transition-all shadow-sm ${
                        currentPage === page
                          ? "bg-[#3252DF] text-white shadow-md cursor-pointer"
                          : "cursor-pointer border border-[#3252DF] text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => getFavorites(token, currentPage + 1)}
                    className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
