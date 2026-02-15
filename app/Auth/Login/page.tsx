"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PORTAL_AUTH_ENDPOINTS } from "@/app/_Api/Api";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authLogin from "../../../assets/images/login.png"; // صورة الخلفية
import logo from "../../../assets/images/login.png"; // استيراد اللوجو هنا كمان

// Material-UI Components
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

// Icons
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility, 
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon
} from "@mui/icons-material";
import AuthComponent from "../AuthComponent/AuthComponent";
import { useAuth } from "@/app/_Context/Authentication";

interface LoginData {
  email: string;
  password: string;
}

interface DecodedToken {
  role: string;
}

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setLoginError("");
    
    try {
      const response = await axios.post(PORTAL_AUTH_ENDPOINTS.LOGIN, data);
      const token = response.data.data.token;
      
      // Save token
      // localStorage.setItem("token", token);
       if (!token) throw new Error("No token received");

      // 👈 استخدم login function لتحديث Context فورًا
      login(token);
      
      // Decode token
      const decoded = jwtDecode<DecodedToken>(token);
      const role = decoded.role;
      
      console.log("Login successful:", response.data);
      
      // Navigate based on role
      if(role === "admin") {
        router.push("/Admin/Dashboard");
      } else {
        router.push("/");
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(
        error?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };
  // Login Form Component
  const LoginForm = (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: "20px", md: "30px" },
            color: "#1a202c",
            mb: 1
          }}
        >
          Sign in
        </Typography>
        <Typography>
          If you don’t have an account register <br/> You can {" "}
          <Link href="/Auth/Register" className="font-bold text-[#EB5148]"> Register here !</Link>
        </Typography>
      </Box>

      {/* Error Alert */}
      {loginError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {loginError}
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
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

        {/* Password Field */}
        <Box sx={{ mb: 2 }}>
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
                backgroundColor: "#f8fafc",
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

        {/* Forgot Password Link */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Link 
            href="/Auth/Forget"
            style={{ 
              color: "#000000", 
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500
            }}
            className="hover:underline"
          >
            Forgot password?
          </Link>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            background: "#3252DF",
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(102, 126, 234, 0.25)",
            "&:hover": {
              background: "#5a67d8"
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <Divider sx={{ my: 4 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      {/* Social Login */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            borderColor: "#e2e8f0",
            color: "#4a5568",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "white",
            "&:hover": {
              borderColor: "#3252DF",
              backgroundColor: "rgba(102, 126, 234, 0.04)",
            }
          }}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon />}
          sx={{
            py: 1.5,
            borderColor: "#e2e8f0",
            color: "#4a5568",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "white",
            "&:hover": {
              borderColor: "#3252DF",
              backgroundColor: "rgba(102, 126, 234, 0.04)",
            }
          }}
        >
          Facebook
        </Button>
      </Box>

      {/* Register Link */}
      <Typography variant="body2" color="text.secondary" align="center">
        Don't have an account?{" "}
        <Link 
          href="/Auth/Register"
          style={{ 
            color: "#3252DF", 
            fontWeight: 600,
            textDecoration: "none"
          }}
          className="hover:underline"
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );

  return (
    <AuthComponent
      form={LoginForm}
      image={authLogin.src}
      imgHeader="Welcome to Roamhome"
      imgText="Discover unique homes and experiences tailored just for you."
    />
  );
}