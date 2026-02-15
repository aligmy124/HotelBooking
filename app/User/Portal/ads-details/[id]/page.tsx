"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Minus, Plus, Star } from "lucide-react";
import { PORTAL_ADS_ENDPOINTS, PORTAL_BOOKING_ENDPOINTS, PORTAL_COMMENT_ENDPOINTS, PORTAL_REVIEW_ENDPOINTS } from "@/app/_Api/Api";
// icons
import icon1 from "../../../../../assets/images/icon1.png";
import icon2 from "../../../../../assets/images/icon2.png";
import icon3 from "../../../../../assets/images/icon3.png";
import icon4 from "../../../../../assets/images/icon4.png";
import icon5 from "../../../../../assets/images/icon5.png";
import icon6 from "../../../../../assets/images/icon6.png";
import icon7 from "../../../../../assets/images/icon7.png";
import icon8 from "../../../../../assets/images/icon8.png";
import Loading from "@/app/_Shared/_Loading/Loading";
import { useForm } from "react-hook-form";
import Footer from "@/app/_Shared/Footer/Footer";
import { toast } from "react-toastify";

/* ================= TYPES ================= */

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  discount: number;
  images: string[];
}

interface CreatedBy {
  _id: string;
  userName: string;
}

interface Ads {
  _id: string;
  room: Room;
  createdBy: CreatedBy;
}

interface bookingProps {
  startDate: string;
  endDate: string;
  totalPrice: string;
  room: string;
  _id: string;
}

/* ================= COMPONENT ================= */

export default function AdsDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [ads, setAds] = useState<Ads | null>(null);
  const [range, setRange] = useState<DateRange>();
  const [persons, setPersons] = useState(1);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ================= FETCH ================= */
  const getAdsDetails = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        PORTAL_ADS_ENDPOINTS.getAdsDetails(id as string),
      );
      setAds(res.data.data.ads);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // create Booking
  const handleCreateBooking = async () => {
    if (!range?.from || !range?.to)
      return alert("Please select start and end date");

    if (!ads?.room._id) return alert("Room not found");

    const payload = {
      startDate: format(range.from, "yyyy-MM-dd"),
      endDate: format(range.to, "yyyy-MM-dd"),
      totalPrice: Math.round(finalPrice),
      room: ads.room._id,
    };

    try {
      const res = await axios.post(
        PORTAL_BOOKING_ENDPOINTS.createBooking,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      console.log("Booking created:", res.data);

      // 👉 بعد ما الـ booking يتعمل بنجاح
      router.push(`/User/stripePayment/${res.data.data.booking._id}`);
    } catch (error: any) {
      console.error(
        "Create booking failed:",
        error.response?.data || error.message,
      );
    }
  };

   /*****************Review****************** */

  const [rating, setRating] = useState(0);
  const [textReview, setTextReview] = useState("");
  const [textComment, setTextComment] = useState("");
  // للتفاعل مع النجوم
  const handleStarClick = (index: number) => {
    setRating(index + 1); // index يبدأ من 0
  };
  const handelReview = async () => {
    if(!token){
      router.push("/Auth/Login");
      return
    }
    const payLoad={
      roomId:ads?._id,
      rating:rating,
      review:textReview
    }
    try {
      let res = await axios.post(PORTAL_REVIEW_ENDPOINTS.createReview,payLoad, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Review created successfully")
    } catch (error) {
      console.error(error);
      toast.error("You have already added a review for this room")
    }
  };

  /****************Comment********************* */
  const handelComment=async()=>{
    if(!token){
      router.push("/Auth/Login");
      return
    }
    const payLoad={
      roomId:ads?.room._id,
      comment:textComment
    }
    try {
      let res=await axios.post(PORTAL_COMMENT_ENDPOINTS.createComment,payLoad,{
        headers:{Authorization:`${token}`}
      })
      toast.success("Comment created successfully")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!id) return;
    getAdsDetails();
  }, [id]);

  /* ================= CALC ================= */
  const price = ads?.room.price ?? 0;
  const discount = ads?.room.discount ?? 0;

  const finalPrice = price * persons * ((100 - discount) / 100);

  const dateValue =
    range?.from && range?.to
      ? `${format(range.from, "dd MMM yyyy")} - ${format(
          range.to,
          "dd MMM yyyy",
        )}`
      : "";

  /* ================= UI ================= */

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-10">
        {/* Breadcrumb */}
        <div className="text-sm flex gap-2 text-gray-400">
          <Link href="/" className="hover:text-[#152C5B]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#152C5B] font-semibold">Ads Details</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-semibold text-[#152C5B]">
                {ads?.room.roomNumber}
              </h1>
              <p className="text-gray-400 mt-1">Bogor, Indonesia</p>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ads?.room.images.map((img, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl ${
                    i === 0 ? "md:col-span-2 md:h-96" : "md:h-44"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Room image ${i + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col items-center md:flex-row md:items-start gap-10">
              {/* LEFT */}
              <div className="md:w-2/3 space-y-8 ">
                <p className="text-gray-500 leading-relaxed text-sm">
                  Minimal techno is a minimalist subgenre of techno music...
                </p>

                {/* FEATURES */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
                  {[icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8].map(
                    (icon, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Image
                          src={icon}
                          alt="feature"
                          width={36}
                          height={36}
                        />
                        <span className="font-semibold text-[#152C5B]">5</span>
                        <span className="text-sm text-gray-500">Bedrooms</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="md:w-1/3 bg-white rounded-2xl shadow border border-[#E5E5E5] p-10 space-y-6 sticky top-10">
                <h2 className="text-xl font-semibold text-[#152C5B]">
                  Start Booking
                </h2>

                <p className="text-4xl font-bold text-[#1ABC9C]">
                  ${price}
                  <span className="text-gray-400 text-lg font-normal">
                    {" "}
                    / night
                  </span>
                </p>

                <p className="text-red-500 font-semibold">
                  Discount {discount}% Off
                </p>

                {/* DATE */}
                <div className="relative">
                  <div
                    onClick={() => setOpenCalendar(!openCalendar)}
                    className="flex cursor-pointer bg-gray-100 rounded overflow-hidden"
                  >
                    <div className="bg-[#152C5B] p-3">
                      <Calendar className="text-white" />
                    </div>
                    <input
                      readOnly
                      value={dateValue}
                      placeholder="Pick date"
                      className="w-full px-3 bg-transparent outline-none"
                    />
                  </div>

                  {openCalendar && (
                    <div className="absolute z-20 mt-2">
                      <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        className="bg-white rounded-xl shadow p-4"
                      />
                    </div>
                  )}
                </div>

                {/* PERSONS */}
                <div className="flex bg-gray-100 rounded overflow-hidden">
                  <button
                    onClick={() => setPersons(Math.max(1, persons - 1))}
                    className="bg-red-500 p-3"
                  >
                    <Minus className="text-white" />
                  </button>
                  <input
                    readOnly
                    value={`${persons} Person`}
                    className="w-full text-center bg-transparent"
                  />
                  <button
                    onClick={() => setPersons(persons + 1)}
                    className="bg-green-500 p-3"
                  >
                    <Plus className="text-white" />
                  </button>
                </div>

                <p className="text-gray-400 text-sm">
                  You will pay{" "}
                  <span className="text-xl font-semibold text-[#152C5B]">
                    ${finalPrice} USD {""}
                  </span>
                  per {""}
                  <span className="text-xl font-semibold text-[#152C5B]">
                    {persons} person
                  </span>
                </p>

                <button
                  onClick={handleCreateBooking}
                  className="w-full bg-[#3252DF] text-white py-3 rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </>
        )}
                <>
          <div className="flex flex-col md:flex-row gap-6">
            {/* ===== Rate Section ===== */}
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-700">Rate</h2>
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer transition ${
                      i < rating ? "fill-yellow-400" : "fill-white"
                    }`}
                    onClick={() => handleStarClick(i)}
                  />
                ))}
              </div>
              <textarea
                className="mt-2 w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write your rating notes here..."
                value={textReview}
                onChange={(e) => setTextReview(e.target.value)}
              />
              <button className="mt-4 bg-[#3252DF] text-white py-2 w-3/4 md:w-1/2 cursor-pointer " onClick={handelReview}>Submit</button>
            </div>

            {/* ===== Comment Section ===== */}
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Add Your Comment
              </h2>
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write your comment..."
                value={textComment}
                onChange={(e) => setTextComment(e.target.value)}
              />
              <button className="mt-4 bg-[#3252DF] text-white py-2 w-3/4 md:w-1/2 cursor-pointer" onClick={handelComment}>Submit</button>
            </div>
          </div>
        </>
      </section>
      <Footer />
    </>
  );
}
