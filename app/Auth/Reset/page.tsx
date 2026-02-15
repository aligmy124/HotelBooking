"use client";

import React, { useState } from "react";
import authReset from "@/assets/images/reset.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PORTAL_AUTH_ENDPOINTS } from "@/app/_Api/Api";
import AuthComponent from "../AuthComponent/AuthComponent";
import { toast } from "react-toastify";
import { Box, Typography, IconButton, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PinIcon from "@mui/icons-material/Pin";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ResetPasswordFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  seed: string;
}

export default function Reset() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>();
  
  const router = useRouter();
  
  // حالات إظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // مراقبة كلمة المرور للتحقق من تطابقها
  const password = watch("password");

  // دوال إظهار/إخفاء كلمة المرور
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    // التحقق من تطابق كلمة المرور
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(PORTAL_AUTH_ENDPOINTS.RESET_PASSWORD, {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        seed: data.seed,
      });
      
      toast.success("Password reset successfully! You can now login.", {
        position: "top-center",
        autoClose: 3000,
      });
      
      // التوجيه إلى صفحة تسجيل الدخول
      setTimeout(() => {
        router.push("/Auth/Login");
      }, 1500);
      
    } catch (error: any) {
      console.error("Reset password error:", error);
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

  const ResetForm = (
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
          Reset Password
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your new password and OTP code.{" "}
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
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#a0aec0" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          />
        </Box>

        {/* حقل OTP */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            OTP Code
          </Typography>
          <TextField
            {...register("seed", { 
              required: "OTP code is required",
              minLength: {
                value: 4,
                message: "OTP must be at least 4 characters"
              }
            })}
            error={!!errors.seed}
            helperText={errors.seed?.message}
            variant="outlined"
            fullWidth
            placeholder="Enter the OTP code"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinIcon sx={{ color: "#a0aec0" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          />
        </Box>

        {/* حقل كلمة المرور الجديدة */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            New Password
          </Typography>
          <TextField
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#a0aec0" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: "#a0aec0" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          />
        </Box>

        {/* حقل تأكيد كلمة المرور */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Confirm New Password
          </Typography>
          <TextField
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: value => value === password || "Passwords do not match"
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            variant="outlined"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#a0aec0" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                    sx={{ color: "#a0aec0" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          />
        </Box>

        {/* زر إعادة التعيين */}
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
          {isSubmitting ? "Resetting..." : "Reset Password"}
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
      form={ResetForm}
      image={authReset.src}
      imgHeader="Reset Your Password"
      imgText="Enter your new password and OTP code to secure your account."
    />
  );
}