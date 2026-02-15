"use client";
import Image from "next/image";
import sampleImage from "../../assets/images/banner.png";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import { useState } from "react";
import { Calendar, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
export default function HomeSite() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [calc, setCalc] = useState<number>(1);
  const inputValue =
    range?.from && range?.to
      ? `${format(range.from, "dd MMM yyyy")} - ${format(
          range.to,
          "dd MMM yyyy",
        )}`
      : "";
  const startDate = range?.from ? format(range.from, "yyyy-MM-dd") : "";

  const endDate = range?.to ? format(range.to, "yyyy-MM-dd") : "";

  const [openInput, setOpenInput] = useState(false);
  console.log(range);

  // submit
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!startDate || !endDate) return;
    router.push(
      `/User/Links/Explore?startDate=${startDate}&endDate=${endDate}`,
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-3/4 w-full mb-5">
        <h1 className="text-4xl font-bold text-[#152C5B] mb-4">
          Forget Busy Work,
          <br />
          Start Next Vacation
        </h1>
        <p className="text-sm text-[#B0B0B0] mb-9 font-light">
          We provide what you need to enjoy your holiday with family.
          <br /> Time to make another memorable moments.
        </p>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-medium text-[#152C5B]">Start Booking</h2>
          <h2>Pick a Date</h2>
          <div className="relative mb-2">
            <div
              className="flex bg-[#F5F6F8] mt-4 cursor-pointer w-3/4 md:w-1/2"
              onClick={() => setOpenInput(!openInput)}
            >
              <div className="flex items-center justify-center bg-[#152C5B] px-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <input
                type="text"
                readOnly
                value={inputValue}
                placeholder="Select Date Range"
                className="p-2 rounded w-full cursor-pointer focus:outline-none"
              />
            </div>
            <div className="flex  my-4 bg-[#F5F6F8] rounded cursor-pointer  w-3/4 md:w-1/2">
              <div className="flex items-center justify-center bg-[#E74C3C] px-3 ">
                <Minus
                  className="h-5 w-5 text-white"
                  onClick={() => setCalc(calc > 1 ? calc - 1 : 1)}
                />
              </div>
              <input
                type="text"
                readOnly
                value={`${calc} Person`}
                placeholder="1 Person"
                className="p-2 rounded w-full cursor-pointer text-[#152C5B] focus:outline-none"
              />
              <div className="flex items-center justify-center bg-[#FF498B] px-3">
                <Plus
                  className="h-5 w-5 text-white"
                  onClick={() => setCalc(calc + 1)}
                />
              </div>
            </div>
            {openInput && (
              <div className="absolute z-10 mt-2 w-full">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  className="rounded-xl bg-white p-4 shadow-lg"
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setOpenInput(false)}
            type="submit"
            className="mt-4 bg-[#3252DF] text-white py-2 w-3/4 md:w-1/2 cursor-pointer "
          >
            sumit
          </button>
        </form>
      </div>
      <Image
        src={sampleImage || ""}
        alt="Banner Image"
        className="w-full my-5 md:my-0 md:w-1/2 h-auto"
      />
    </div>
  );
}
