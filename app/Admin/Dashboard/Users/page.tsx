"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import delImg from "./../../../../assets/images/Email.png";
import viewImg from "./../../../../assets/images/pic (3).png";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "@/app/_Shared/_Loading/Loading";
import {
  FormControl,
  Skeleton,
  InputLabel,
  Select,
  Avatar,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { AUTH_ADMIN_ENDPOINTS } from "@/app/_Api/Api";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface User {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: number;
  country: string;
  role: "admin" | "user";
  profileImage: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditUserPayload {
  userName?: string;
  email?: string;
  phoneNumber?: number;
  country?: string;
  role?: string;
  verified?: boolean;
}

export default function UsersTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modal View
  const [openModalView, setOpenModalView] = useState(false);
  const [userView, setUserView] = useState<User | undefined>(undefined);
  const handleOpenModalView = async (userId: string, user: User) => {
    if (!userId) return;
    setOpenModalView(true);
    setSelectedId(userId);
    setUserView(user);
  };
  const handleCloseModalView = () => setOpenModalView(false);

  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    userId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  // Data States
  const [usersData, setUsersData] = useState<User[] | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 100;

  // Fetch Users
  const fetchUsers = async (token: string | null, page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(AUTH_ADMIN_ENDPOINTS.getAllusers, {
        headers: { Authorization: `${token}` },
        params: { page, size: pageSize },
      });
      setUsersData(res.data.data.users);
      const totalCount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalCount / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    setToken(storedToken);
    fetchUsers(storedToken, 1);
  }, []);

  return (
    <>
      {/* View Modal */}
      <Modal open={openModalView} onClose={handleCloseModalView}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Loading />
          </Box>
        ) : (
          <Box
            sx={styleModal}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              borderRadius: "12px",
              maxWidth: "400px",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              User Details
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Avatar
                src={userView?.profileImage}
                sx={{ width: 100, height: 100 }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography>
                <strong>Username:</strong> {userView?.userName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {userView?.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {userView?.phoneNumber}
              </Typography>
              <Typography>
                <strong>Country:</strong> {userView?.country}
              </Typography>
              <Typography>
                <strong>Role:</strong> {userView?.role}
              </Typography>
              <Typography>
                <strong>Verified:</strong> {userView?.verified ? "Yes" : "No"}
              </Typography>
              <Typography>
                <strong>Created:</strong>{" "}
                {new Date(userView?.createdAt || "").toLocaleDateString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleCloseModalView}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        )}
      </Modal>

      <Box
        sx={{
          mb:2
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "500",
            color: "#rgba(31, 38, 62, 1)",
            fontSize:"20px",
            
          }}
        >
          Users Table Details
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "400",
            color: "#rgba(31, 38, 62, 1)",
            fontSize:"14px",

          }}
        >
          You can check all details
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: "rgba(226, 229, 235, 1)" }}>
              <TableCell>Profile</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Country</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Verified</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="circular" width={40} height={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={150} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={60} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={40} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={90} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton width={40} height={40} />
                    </TableCell>
                  </TableRow>
                ))
              : usersData?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar
                        src={user.profileImage}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>0{user.phoneNumber}</TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color:
                            user.role === "admin" ? "primary.main" : "inherit",
                          fontWeight: user.role === "admin" ? "bold" : "normal",
                        }}
                      >
                        {user.role}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: user.verified ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {user.verified ? "Yes" : "No"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={(e) => handleClick(e, user._id)}>
                        <MenuItem
                          onClick={() => {
                            handleOpenModalView(user._id, user);
                            handleClose();
                          }}
                        >
                          <VisibilityIcon
                            sx={{ mr: 1}}
                          />
                         
                        </MenuItem>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-1">
            {/* Prev */}
            {currentPage > 1 && (
              <button
                onClick={() => fetchUsers(token, currentPage - 1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Prev
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchUsers(token, page)}
                className={`min-w-9 rounded-full py-2 px-3.5 text-sm transition-all shadow-sm ${
                  currentPage === page
                    ? "bg-[#3252DF] text-white shadow-md cursor-pointer"
                    : "cursor-pointer border border-[#3252DF] text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            {currentPage < totalPages && (
              <button
                onClick={() => fetchUsers(token, currentPage + 1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
