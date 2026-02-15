"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { PORTAL_ADS_ENDPOINTS, PORTAL_FAVOURITE_ENDPOINTS } from "../_Api/Api";
import { Eye, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
// import ll from '../User/Portal/room-details/[id]/page'
interface adsRoom {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  images: string[];
}

interface adsType {
  _id: string;
  isActive: boolean;
  room: adsRoom;
  createdBy: {
    _id: string;
    userName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Ads() {
  const [ads, setAds] = useState<adsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // تخزين التوكن

  useEffect(() => {
    // يشتغل بس على العميل
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    getAdsData(1);
  }, []);
    // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const getAdsData = async (page:number) => {
    setLoading(true);
    try {
      let res = await axios.get(PORTAL_ADS_ENDPOINTS.getAds);
      setAds(res.data.data.ads);
      const totalCount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalCount / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.log("Error fetching ads data:", error);
    } finally {
      setLoading(false);
    }
  };
  // add favorite
  const addFavorite = async (roomid: string) => {
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
      toast("Room is already in your favorites");
    }
  };

  return (
    <div className="my-2">
        <h2 className="text-[#152C5B] text-2xl font-medium mb-4">
        Most popular ads
      </h2>
      {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="h-64 w-full rounded-2xl bg-gray-200 animate-pulse"
      />
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
    {ads.map((item, index) => (
      <div
        key={item._id}
        className={`${index === 0 ? "lg:row-span-2" : ""} group`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg bg-white">
          {/* Image */}
          <Image
            src={item.room.images?.[0] || "/placeholder.jpg"}
            alt={`Room ${item.room.roomNumber}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Discount Badge */}
          {item.room.discount > 0 && (
            <div className="absolute top-4 left-4 bg-[#E5427D] text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
              {item.room.discount}% OFF
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 p-5 w-full text-white space-y-1">
            <h3 className="text-lg font-semibold">
              Room {item.room.roomNumber}
            </h3>

            <p className="text-sm text-gray-200">
              Capacity: {item.room.capacity} persons
            </p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xl font-bold text-[#E5427D]">
                ${item.room.price}
              </span>

              <div className="flex gap-4">
                <Heart
                  onClick={() => addFavorite(item.room._id)}
                  className="cursor-pointer hover:text-[#E5427D] transition"
                />
                <Eye
                  onClick={() =>
                    router.push(`/User/Portal/ads-details/${item._id}`)
                  }
                  className="cursor-pointer hover:text-[#E5427D] transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-1">
            {/* Prev */}
            {currentPage > 1 && (
              <button
                onClick={() => getAdsData(currentPage-1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Prev
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => getAdsData(page)}
                className={`min-w-9 rounded-full py-2 px-3.5 text-sm transition-all shadow-sm ${
                  currentPage === page
                    ? "bg-[#3252DF] text-white shadow-md cursor-pointer"
                    : "cursor-pointer border border-[#3252DF] text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            {currentPage < totalPages && (
              <button
                onClick={() => getAdsData(currentPage + 1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
