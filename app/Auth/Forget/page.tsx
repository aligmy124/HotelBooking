"use client";

import React from "react";
import authForget from "../../../assets/images/forget.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { PORTAL_AUTH_ENDPOINTS } from "@/app/_Api/Api";
import AuthComponent from "../AuthComponent/AuthComponent";

interface ForgetPasswordFormValues {
  email: string;
}

export default function Forget() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormValues>();
  
  const router = useRouter();

  const onSubmit: SubmitHandler<ForgetPasswordFormValues> = async (data) => {
    try {
      const response = await axios.post(PORTAL_AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email: data.email,
      });
      
      toast.success("OTP sent successfully! Please check your email", {
        position: "top-center",
        autoClose: 3000,
      });
      
      // حفظ البريد الإلكتروني مؤقتاً لاستخدامه في صفحة إعادة التعيين
      localStorage.setItem("resetEmail", data.email);
      
      // التوجيه إلى صفحة إعادة تعيين كلمة المرور
      setTimeout(() => {
        router.push("/Auth/Reset");
      }, 1500);
      
    } catch (error: any) {
      console.error("Forget password error:", error);
      toast.error(
        error?.response?.data?.message || 
        error?.message || 
        "An error occurred. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  const ForgetForm = (
    <Box sx={{ width: "100%" }}>
      {/* الهيدر */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: "28px", md: "36px" },
            color: "#1a202c",
            mb: 1
          }}
        >
          Forget Password
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your email to reset your password.{" "}
          <Link 
            href="/Auth/Login"
            style={{ 
              color: "#EB5148", 
              fontWeight: 600,
              textDecoration: "none"
            }}
            className="hover:underline"
          >
            login here !
          </Link>
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* حقل البريد الإلكتروني */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Email Address
          </Typography>
          <TextField
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="outlined"
            fullWidth
            placeholder="Enter your email address"
            size="medium"
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                  <EmailIcon sx={{ color: "#a0aec0" }} />
                </Box>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
                "&:hover fieldset": {
                  borderColor: "#3252DF",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3252DF",
                },
              },
            }}
          />
        </Box>

        {/* زر إرسال */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            mt: 2,
            background: "#3252DF",
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(50, 82, 223, 0.25)",
            "&:hover": {
              background: "#2540b0",
            },
            "&:disabled": {
              background: "#a0aec0",
            }
          }}
        >
          {isSubmitting ? "Sending..." : "Send mail"}
        </Button>

        {/* رابط المساعدة */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Remember your password?{" "}
          <Link 
            href="/Auth/Login"
            style={{ 
              color: "#3252DF", 
              fontWeight: 600,
              textDecoration: "none"
            }}
            className="hover:underline"
          >
            Sign in
          </Link>
        </Typography>
      </form>
    </Box>
  );

  return (
    <AuthComponent
      form={ForgetForm}
      image={authForget.src}
      imgHeader="Reset Your Password"
      imgText="Enter your email and we'll send you instructions to reset your password."
    />
  );
}