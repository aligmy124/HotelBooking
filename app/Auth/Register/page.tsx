"use client";

import React, { useState } from "react";
import authRegister from "../../../assets/images/register.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, Typography, MenuItem, IconButton, InputAdornment } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { PORTAL_AUTH_ENDPOINTS } from "@/app/_Api/Api";
import AuthComponent from "../AuthComponent/AuthComponent";

// ✅ تعريف واجهة البيانات مع الدور
interface FormValues {
  email: string;
  password: string;
  userName: string;
  phoneNumber: string;
  country: string;
  confirmPassword: string;
  profileImage: File | null;
  role: string;
}

// ✅ تخصيص زر رفع الصورة
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// ✅ مكون رفع الصورة المحسن
const ImageUpload: React.FC<{
  onChange: (file: File | null) => void;
  error?: string;
  value?: File | null;
}> = ({ onChange, error }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);

    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // التحقق من حجم الملف (أقل من 2 ميجابايت)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
        Profile Image
      </Typography>
      
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{
          width: "100%",
          py: 1.5,
          borderColor: "#e2e8f0",
          color: "#4a5568",
          textTransform: "none",
          borderRadius: 2,
          backgroundColor: "#f8fafc",
          "&:hover": {
            borderColor: "#3252DF",
            backgroundColor: "rgba(50, 82, 223, 0.04)",
          }
        }}
      >
        Upload Profile Image
        <VisuallyHiddenInput 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {preview && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #3252DF",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={preview}
              alt="Profile preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Box>
      )}
      
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default function Register() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      role: "user", // ✅ تعيين القيمة الافتراضية للمستخدم العادي
    }
  });
  
  const router = useRouter();
  
  // ✅ حالات إظهار/إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // ✅ مراقبة كلمة المرور للتحقق من تطابقها
  const password = watch("password");

  // ✅ دوال إظهار/إخفاء كلمة المرور
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  // ✅ دالة التسجيل المحسنة
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // التحقق من تطابق كلمة المرور
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      
      // إضافة البيانات إلى FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profileImage' && value) {
          formData.append(key, value.toString());
        }
      });
      
      // إضافة الصورة إذا وجدت
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const response = await axios.post(
        PORTAL_AUTH_ENDPOINTS.REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // حفظ التوكن
      if (response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      
      // حفظ دور المستخدم
      localStorage.setItem("role", data.role);
      
      toast.success("🎉 Registered successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      // توجيه حسب الدور
      setTimeout(() => {
        if (data.role === "admin") {
          router.push("/Admin/Dashboard");
        } else {
          router.push("/");
        }
      }, 1500);

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        error?.response?.data?.message || 
        error?.message || 
        "An error occurred during registration",
        {
          position: "top-center",
        }
      );
    }
  };

  // ✅ نموذج التسجيل
  const RegisterForm = (
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
          Create Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join us today! If you already have an account{" "}
          <Link 
            href="/Auth/Login"
            style={{ 
              color: "#EB5148", 
              fontWeight: 600,
              textDecoration: "none"
            }}
            className="hover:underline"
          >
            Login here !
          </Link>
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* اسم المستخدم */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Username
          </Typography>
          <TextField
            {...register("userName", { 
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters"
              }
            })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
            variant="outlined"
            fullWidth
            placeholder="Enter your username"
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          />
        </Box>

        {/* الهاتف والدولة - باستخدام Box بدلاً من Grid */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Phone Number
            </Typography>
            <TextField
              {...register("phoneNumber", { 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+\-\s()]{10,15}$/,
                  message: "Please enter a valid phone number"
                }
              })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              variant="outlined"
              fullWidth
              placeholder="Enter your phone number"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#F5F6F8",
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Country
            </Typography>
            <TextField
              {...register("country", { required: "Country is required" })}
              error={!!errors.country}
              helperText={errors.country?.message}
              variant="outlined"
              fullWidth
              placeholder="Enter your country"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#F5F6F8",
                },
              }}
            />
          </Box>
        </Box>

        {/* البريد الإلكتروني */}
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
            placeholder="Enter your email"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          />
        </Box>

        {/* كلمة المرور - مع أيقونة العين */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Password
            </Typography>
            <TextField
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              InputProps={{
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Confirm Password
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
              placeholder="Confirm your password"
              InputProps={{
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
        </Box>

        {/* نوع الحساب */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Account Type
          </Typography>
          <TextField
            {...register("role", { required: "Please select account type" })}
            error={!!errors.role}
            helperText={errors.role?.message}
            variant="outlined"
            select
            fullWidth
            defaultValue="user"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F5F6F8",
              },
            }}
          >
            <MenuItem value="user">Regular User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </Box>

        {/* رفع الصورة */}
        <Controller
          name="profileImage"
          control={control}
          rules={{ 
            required: "Profile image is required",
            validate: {
              fileSize: (file) => 
                !file || file.size <= 2 * 1024 * 1024 || "Image must be less than 2MB",
              fileType: (file) =>
                !file || file.type.startsWith('image/') || "Please upload an image file"
            }
          }}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <ImageUpload onChange={onChange} error={error?.message} />
          )}
        />

        {/* زر التسجيل */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            mt: 3,
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
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </Button>

        {/* رابط تسجيل الدخول */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
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
      form={RegisterForm}
      image={authRegister.src}
      imgHeader="Welcome to Staycation"
      imgText="Your journey to unique stays begins here."
    />
  );
}