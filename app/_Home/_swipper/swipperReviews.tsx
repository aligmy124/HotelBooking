"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import img1 from "../../../assets/images/picture.png"
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    title: "Happy Family",
    rating: 5,
    text: "What a great trip with my family and I should try again next time soon ...",
    author: "Angga, Product Designer",
    image: "/picture.png",
  },
  {
    title: "Wonderful Moment",
    rating: 5,
    text: "Amazing experience and beautiful memories with my loved ones.",
    author: "Sarah, UI Designer",
    image: "/picture2.jpg",
  },
  {
    title: "Unforgettable Trip",
    rating: 4,
    text: "The journey was smooth, the places were stunning, and everything felt perfectly organized.",
    author: "Michael, Software Engineer",
    image: "/picture3.jpg",
  },
  {
    title: "Best Family Time",
    rating: 5,
    text: "Spending quality time with my family in such a beautiful place was truly priceless.",
    author: "Emily, Marketing Specialist",
    image: "/picture4.jpg",
  },
];

export default function TestimonialSwiper() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        loop
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              
              {/* Image */}
              <div className="relative w-full h-105 rounded-[40px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-semibold text-[#152C5B] mb-4">
                  {item.title}
                </h3>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>

                <p className="text-xl text-[#152C5B] leading-relaxed mb-6 max-w-lg">
                  {item.text}
                </p>

                <span className="text-gray-400">{item.author}</span>

                {/* Navigation */}
                <div className="flex gap-6 mt-10">
                  <button className="prev-btn cursor-pointer w-14 h-14 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <ArrowLeft />
                  </button>

                  <button className="next-btn cursor-pointer w-14 h-14 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <ArrowRight />
                  </button>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
