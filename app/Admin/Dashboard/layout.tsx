// import Navbar from "@/app/_Shared/Navbar";
// import Sidebar from "./_Sidebar/Sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//       <div className="flex">
//         {/* Sidebar */}
//         <div>
//           <Sidebar />
//         </div>

//         {/* Main Content */}
//           <div className="p-4">
//             {children}
//           </div>
//       </div>
//   );
// }

"use client";

import React, { useState , useEffect} from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import Sidebar from "./_Sidebar/Sidebar";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "@/app/_Context/Authentication";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PORTAL_AUTH_ENDPOINTS } from "@/app/_Api/Api";

interface PropsProfile {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: number;
  profileImage: string;
  country: string;
  verified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isLogin}=useAuth();
  console.log(isLogin)
  const router=useRouter();
  const [user, setUser] = useState<PropsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileId=isLogin?._id;
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token || !profileId) return;
  
      const getProfile = async () => {
        try {
          const res = await axios.get(
            PORTAL_AUTH_ENDPOINTS.PROFILE(profileId as string),
            {
              headers: { Authorization: `${token}` },
            }
          );
          setUser(res.data.data.user);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
  
      getProfile();
    }, [profileId]);
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          color="default"
          sx={{
            boxShadow: "none",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Toolbar>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%", // 🔥 ده المهم
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                Stay<span style={{ color: "#2563eb" }}>Cation</span>
              </Typography>
              <Avatar alt="Admin Avatar" sx={{cursor:"pointer"}} onClick={()=>router.push(`./../../User/Links/Profile/${isLogin?._id}`)} src={user?.profileImage} />
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ py: 5, flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
