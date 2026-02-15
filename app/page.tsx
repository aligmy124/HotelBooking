"use client";
import { useEffect } from "react";
import Ads from "./_Home/Ads";
import HomeSite from "./_Home/Home";
import Footer from "./_Shared/Footer/Footer";
import SwipperReviews from './_Home/_swipper/swipperReviews';
import Navbar from "./_Shared/Navbar";
import { useAuth } from "./_Context/Authentication";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLogin?.role === "admin") {
      router.push("/Admin/Dashboard");
    }
  }, [isLogin, router]); // ✅ depend on isLogin

  return (
    <>
      {(!isLogin || isLogin.role === "user") && (
        <div>
          <Navbar />
          <HomeSite />
          <Ads />
          <SwipperReviews />
          <Footer />
        </div>
      )}
    </>
  );
}
