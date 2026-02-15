"use client";
import { PORTAL_BOOKING_ENDPOINTS } from "@/app/_Api/Api";
import Loading from "@/app/_Shared/_Loading/Loading";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  startDate: string; // or Date if you want to convert it
  endDate: string; // or Date
  totalPrice: number;
  user: {
    _id: string;
  };
  room: string;
  status: "pending" | "confirmed" | "canceled"; // you can extend with other statuses
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

export default function MyBooking() {
  const [myBooking, setMyBooking] = useState<Booking[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/Auth/Login");
      return;
    }
    setToken(storedToken);
    getMyAllBooking(storedToken);
  }, [token]);
  const getMyAllBooking = async (token: string) => {
    setLoading(true);
    try {
      let res = await axios.get(PORTAL_BOOKING_ENDPOINTS.GETALLBOOKING, {
        headers: { Authorization: `${token}` },
      });
      console.log(res.data.data.myBooking);
      setMyBooking(res.data.data.myBooking);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center my-5">
        <h1 className="text-[#3252DF] text-xl md:text-2xl font-bold mb-4">
          my Booking
        </h1>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loading/>
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {myBooking?.map((booking) => (
            <div
              key={booking._id}
              className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Status with color */}
              <p
                className={`mb-2 font-semibold ${
                  booking.status === "confirmed"
                    ? "text-green-600"
                    : booking.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                📌 Status: {booking.status.toUpperCase()}
              </p>

              {/* Price */}
              <p className="text-gray-700 mb-1">
                💲 Price:{" "}
                <span className="font-medium">${booking.totalPrice}</span>
              </p>

              {/* Dates */}
              <div className="flex justify-between text-gray-500 text-sm">
                <p>
                  🟢 Start: {new Date(booking.startDate).toLocaleDateString()}
                </p>
                <p>🔴 End: {new Date(booking.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <button className="px-8 py-1 bg-[#3252DF] text-white cursor-pointer" onClick={()=>router.back()}>back</button> */}

    </>
  );
}
