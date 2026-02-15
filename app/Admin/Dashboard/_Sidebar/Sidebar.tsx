"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SvgIcon from "@mui/material/SvgIcon";
import { toast } from "react-toastify";
import { useAuth } from "@/app/_Context/Authentication";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CampaignIcon from "@mui/icons-material/Campaign";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
const drawerWidth = 240;
const collapsedDrawerWidth = 60;

function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    toast.success("Log Out Success");
    localStorage.removeItem("token");
    logout();
  };

  const menuItems = [
    { text: "Home", link: "../../../Admin/Dashboard", icon: <HomeIcon /> },
    {
      text: "Users",
      link: "../../../Admin/Dashboard/Users",
      icon: <PeopleIcon />,
    },
    {
      text: "Room",
      link: "../../../Admin/Dashboard/Rooms",
      icon: <MeetingRoomIcon />,
    },
    {
      text: "Ads",
      link: "../../../Admin/Dashboard/Ads",
      icon: <BorderAllIcon />,
    },
    {
      text: "Booking",
      link: "../../../Admin/Dashboard/Booking",
      icon: <CalendarMonthIcon />,
    },
    // { text: "ChangePassword", link: "/ChangePass", icon: <LockResetIcon /> },
    {
      text: "Logout",
      link: "../../../Auth/Login",
      onClick: handleLogout,
      icon: <LogoutIcon />,
    },
  ];

  const [isCollapse, setIsCollapse] = useState(true);

  const toggleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${isCollapse ? collapsedDrawerWidth : drawerWidth}px)`,
            ml: `${isCollapse ? collapsedDrawerWidth : drawerWidth}px`,
            backgroundColor: "rgba(226, 229, 235, 1)",
            boxShadow: "none",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            transition: "width 0.3s, margin-left 0.3s",
          }}
        />
        <Drawer
          sx={{
            width: isCollapse ? collapsedDrawerWidth : drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isCollapse ? collapsedDrawerWidth : drawerWidth,
              boxSizing: "border-box",
              bgcolor: "rgba(32, 63, 199, 1)",
              color: "rgba(226, 229, 235, 1)",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <SvgIcon
            onClick={toggleCollapse}
            sx={{ cursor: "pointer", color: "#fff", marginLeft: "15px" }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              style={{ width: "24px", height: "24px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
              />
            </svg>
          </SvgIcon>

          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  component={Link}
                  href={item.link}
                  onClick={item.onClick} // Correct usage for onClick
                  sx={{
                    minHeight: 48,
                    justifyContent: isCollapse ? "center" : "initial",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapse ? "auto" : 3,
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(item.icon, { sx: { color: "#fff" } })}
                  </ListItemIcon>

                  {!isCollapse && (
                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: isCollapse ? 0 : 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
      </Box>
    </>
  );
}

export default Sidebar;
