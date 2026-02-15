"use client";

import {
  PORTAL_FAVOURITE_ENDPOINTS,
  PORTAL_ROOMS_ENDPOINTS,
} from "@/app/_Api/Api";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/app/_Shared/Footer/Footer";

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  images: string[];
  discount: number;
}

export default function ExploreRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8; // عدد الغرف في كل صفحة
  // useSearch
  const searchParams = useSearchParams();
  const start = searchParams.get("startDate");
  const end = searchParams.get("endDate");

  useEffect(() => {
    // لو في توكن
      fetchRooms(1, start || undefined, end || undefined);

  }, [start, end]);

  const fetchRooms = async (
    page: number,
    startDate?: string,
    endDate?: string,
  ) => {
    setLoading(true);

    try {
      const res = await axios.get(PORTAL_ROOMS_ENDPOINTS.getRooms, {
        params: {
          page,
          size: pageSize,
          ...(startDate && { startDate }), // لو موجود startDate
          ...(endDate && { endDate }), // لو موجود endDate
        },
      });

      setRooms(res.data.data.rooms);
      const totalCount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalCount / pageSize));
      setCurrentPage(page);
    } catch (error: any) {
      console.error(
        "Fetch rooms error:",
        error.response?.data || error.message,
      );
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  // add favorite
  const addFavorite = async (roomid: string) => {
    const storedToken=localStorage.getItem("token");
    if(!storedToken){
      toast.error("Unauthorized");
      return;
    }
    setToken(storedToken)
    try {
      const res = await axios.post(
        PORTAL_FAVOURITE_ENDPOINTS.addFavourite,
        { roomId: roomid },
        {
          headers: { Authorization: `${token}` },
        },
      );
      toast.success("Added to favorites!");
      console.log("success");
    } catch (error) {
      console.log(error);
      toast.error("Room is already in your favorites");
    }
  };

  return (
    <>
    <section className="my-10">
      <div className="text-sm flex gap-2 text-gray-400 mb-2">
        <Link href="/" className="hover:text-[#152C5B]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#152C5B] font-semibold">Explore</span>
      </div>
      {/* Title */}
      <div className="text-center mb-5">
        <h1 className="text-4xl font-semibold text-[#152C5B]">
          Explore All Rooms
        </h1>
      </div>
      <div className="mb-5">
        <h2 className="font-medium text-2xl text-[#152C5B]">All Rooms</h2>
      </div>

      {/* Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={room.images[0] || ""}
                    alt={`Room ${room.roomNumber}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {room.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-[#FF498B] text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
                      {room.discount}% OFF
                    </div>
                  )}

                  {/* Center Icons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-10">
                    <button className="p-3 rounded-full cursor-pointer bg-white/90 hover:bg-[#FF498B] hover:text-white transition">
                      <Heart onClick={() => addFavorite(room._id)} size={22} />
                    </button>
                    <button className="p-3 rounded-full cursor-pointer bg-white/90 hover:bg-[#FF498B] hover:text-white transition">
                      <Eye
                        onClick={() =>
                          router.push(`/User/Portal/room-details/${room._id}`)
                        }
                        size={22}
                      />
                    </button>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 w-full p-5 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <h3 className="text-lg font-semibold">
                      Room {room.roomNumber}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-1">
                {currentPage > 1 && (
                  <button
                    onClick={() =>
                      fetchRooms(currentPage - 1, start!, end!)
                    }
                    className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm"
                  >
                    Prev
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => fetchRooms(page, start!, end!)}
                      className={`min-w-9 cursor-pointer rounded-full py-2 px-3.5 text-sm ${
                        currentPage === page
                          ? "bg-[#3252DF] text-white"
                          : "border border-[#3252DF]"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {currentPage < totalPages && (
                  <button
                    onClick={() =>
                      fetchRooms(currentPage + 1, start!, end!)
                    }
                    className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
    <Footer/>
    </>
  );
}
