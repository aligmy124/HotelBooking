"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { PORTAL_BOOKING_ENDPOINTS } from "@/app/_Api/Api";
import { toast } from "react-toastify";
import Footer from "@/app/_Shared/Footer/Footer";
import {useRouter} from "next/navigation"
export default function PaymentPage() {
  const params = useParams();
  const bookingId = params.id; // ID جاي من الرابط dynamic route /payment/[id]
  const router=useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState({
    fullName: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [card, setCard] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  // Validation لكل خطوة
  const isStepOneValid =
    billing.fullName &&
    billing.country &&
    billing.address1 &&
    billing.city &&
    billing.postalCode;

  const isStepTwoValid =
    card.cardNumber.length >= 16 &&
    card.expiry.length >= 4 &&
    card.cvc.length >= 3;

  // token
  const token = localStorage.getItem("token");

  // ====== Handle Payment ======
  const handlePayment = async () => {
    if (!bookingId) return alert("Booking ID missing!");

    const userToken = localStorage.getItem("token");
    if (!userToken) return alert("User not authenticated");

    try {
      setLoading(true);

      const res = await axios.post(
        PORTAL_BOOKING_ENDPOINTS.pay(bookingId as string),
        {
          token: "tok_visa", // 👈 mock stripe token (زي postman)
        },
        {
          headers: {
            Authorization: `${userToken}`, // 👈 JWT هنا
          },
        },
      );

      console.log("Payment success:", res.data);
      toast.success("Booking successfully");
      setStep(3); // Confirmation
    } catch (error: any) {
      console.error("Payment failed:", error.response?.data || error.message);
      toast.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen flex justify-center items-start bg-gray-50 py-16">
        <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-10">
          {/* ===== Stepper ===== */}
          <div className="mb-10">
            <h2 className="text-center text-xl font-semibold mb-6">
              Payment Process
            </h2>
            <div className="flex justify-center gap-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${step >= s ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"}`}
                  >
                    {s}
                  </div>
                  <span
                    className={`text-sm mt-2 ${step === s ? "text-emerald-500" : "text-gray-400"}`}
                  >
                    {s === 1
                      ? "Billing Address"
                      : s === 2
                        ? "Payment Details"
                        : "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Step 1 ===== */}
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Payment</h1>
              <p className="text-center text-gray-400 mb-8">
                Kindly follow the instructions below
              </p>
              <div className="space-y-4">
                <Input
                  label="Full name"
                  value={billing.fullName}
                  onChange={(v) => setBilling({ ...billing, fullName: v })}
                />
                <Input
                  label="Country or region"
                  value={billing.country}
                  onChange={(v) => setBilling({ ...billing, country: v })}
                />
                <Input
                  label="Address line 1"
                  value={billing.address1}
                  onChange={(v) => setBilling({ ...billing, address1: v })}
                />
                <Input
                  label="Address line 2"
                  value={billing.address2}
                  onChange={(v) => setBilling({ ...billing, address2: v })}
                />
                <Input
                  label="City"
                  value={billing.city}
                  onChange={(v) => setBilling({ ...billing, city: v })}
                />
                <Input
                  label="Postal code"
                  value={billing.postalCode}
                  onChange={(v) => setBilling({ ...billing, postalCode: v })}
                />
              </div>
            </>
          )}

          {/* ===== Step 2 ===== */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Payment Details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  value={card.cardNumber}
                  onChange={(v) =>
                    setCard({ ...card, cardNumber: v.replace(/\D/g, "") })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="MM / YY"
                    value={card.expiry}
                    onChange={(v) => setCard({ ...card, expiry: v })}
                  />
                  <Input
                    label="CVC"
                    value={card.cvc}
                    onChange={(v) =>
                      setCard({ ...card, cvc: v.replace(/\D/g, "") })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* ===== Step 3 ===== */}
          {step === 3 && (
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-emerald-500 mb-4">
                Booking Confirmed 🎉
              </h2>
              <p className="text-gray-500">Payment completed successfully</p>
            </div>
          )}

          {/* ===== Actions ===== */}
          <div className="flex justify-between mt-10">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 rounded-md text-sm cursor-pointer"
            >
              Cancel
            </button>

            {step < 3 && (
              <button
                disabled={
                  (step === 1 && !isStepOneValid) ||
                  (step === 2 && !isStepTwoValid) ||
                  loading
                }
                onClick={() => {
                  if (step === 2) handlePayment();
                  else setStep(step + 1);
                }}
                className="px-6 py-2 bg-blue-600 text-white cursor-pointer rounded-md text-sm disabled:opacity-50"
              >
                {step === 2
                  ? loading
                    ? "Processing..."
                    : "Pay Now"
                  : "Continue to Book"}
              </button>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ===== Inputs ===== */
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
