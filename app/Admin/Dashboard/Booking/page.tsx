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
import { BOOKING_ADMIN_ENDPOINTS } from "@/app/_Api/Api";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import delImg from "./../../../../assets/images/Email.png";
import viewImg from "./../../../../assets/images/pic (3).png";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "@/app/_Shared/_Loading/Loading";
import { FormControl, Skeleton, InputLabel, Select } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

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
}

interface Room {
  _id: string;
  roomNumber: string;
}

interface Booking {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  user: User;
  room: Room | null;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  stripeChargeId?: string;
}

export default function BookingsTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Modal Delete
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = (bookingId: string) => {
    setOpenDelete(true);
    setSelectedId(bookingId);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  // Modal View
  const [openModalView, setOpenModalView] = useState(false);
  const [bookingView, setBookingView] = useState<Booking | undefined>(undefined);
  const handleOpenModalView = async (bookingId: string) => {
    if (!bookingId) return;
    setOpenModalView(true);
    setSelectedId(bookingId);
    await ViewBooking(bookingId);
  };
  const handleCloseModalView = () => setOpenModalView(false);

  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuBookingId, setMenuBookingId] = useState<string | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, bookingId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuBookingId(bookingId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuBookingId(null);
  };

  // Data States
  const [bookingsData, setBookingsData] = useState<Booking[] | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 50;
  const fetchBookings = async (token: string | null, page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(BOOKING_ADMIN_ENDPOINTS.getBooking, {
        headers: { Authorization: `${token}` },
        params: { page, size: pageSize },
      });
      setBookingsData(res.data.data.booking);
      const totalCount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalCount / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Delete Booking
  const deleteBooking = async () => {
    if (!selectedId || !token) return;
    try {
      await axios.delete(BOOKING_ADMIN_ENDPOINTS.delete(selectedId), {
        headers: { Authorization: token },
      });
      toast.success("Booking deleted successfully");
      fetchBookings(token, currentPage);
      handleCloseDelete();
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  // View Booking
  const ViewBooking = async (bookingId: string) => {
    if (!bookingId || !token) return;
    setLoading(true);
    try {
      const res = await axios.get(BOOKING_ADMIN_ENDPOINTS.view(bookingId), {
        headers: { Authorization: token },
      });
      setBookingView(res.data.data.booking);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    setToken(storedToken);
    fetchBookings(storedToken, 1);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "green", bg: "rgba(144, 238, 144, 0.2)" };
      case "pending":
        return { color: "orange", bg: "rgba(255, 165, 0, 0.2)" };
      case "cancelled":
        return { color: "red", bg: "rgba(255, 99, 71, 0.2)" };
      default:
        return { color: "gray", bg: "rgba(128, 128, 128, 0.2)" };
    }
  };

  return (
    <>
      {/* Delete Modal */}
      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box sx={styleModal} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "15px",
        }}>
          <Image
            src={delImg}
            alt="Delete Image"
            width={120}
            height={120}
            className="object-cover rounded-full"
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Delete This Booking?
          </Typography>
          <Typography sx={{ color: "#555" }}>
            Are you sure you want to delete this booking?
          </Typography>
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Button variant="outlined" color="primary" onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={deleteBooking}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* View Modal */}
      <Modal open={openModalView} onClose={handleCloseModalView}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Loading />
          </Box>
        ) : (
          <Box sx={styleModal} style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            borderRadius: "12px",
            maxWidth: "400px",
          }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
              Booking Details
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>
                <strong>User:</strong> {bookingView?.user?.userName}
              </Typography>
              <Typography>
                <strong>Room:</strong> {bookingView?.room?.roomNumber || "Deleted Room"}
              </Typography>
              <Typography>
                <strong>Start Date:</strong> {new Date(bookingView?.startDate || "").toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>End Date:</strong> {new Date(bookingView?.endDate || "").toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Total Price:</strong> ${bookingView?.totalPrice}
              </Typography>
              <Typography>
                <strong>Status:</strong> 
                <span style={{ 
                  color: getStatusColor(bookingView?.status || "").color,
                  marginLeft: "8px",
                  fontWeight: "bold"
                }}>
                  {bookingView?.status}
                </span>
              </Typography>
              {bookingView?.stripeChargeId && (
                <Typography>
                  <strong>Payment ID:</strong> {bookingView.stripeChargeId}
                </Typography>
              )}
            </Box>

            <Button variant="contained" onClick={handleCloseModalView} sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        )}
      </Modal>

      {/* Table Header */}
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
          Booking Table Details
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
              <TableCell>User</TableCell>
              <TableCell>Room</TableCell>
              <TableCell align="center">Start Date</TableCell>
              <TableCell align="center">End Date</TableCell>
              <TableCell align="center">Total Price</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell align="center"><Skeleton width={90} /></TableCell>
                  <TableCell align="center"><Skeleton width={90} /></TableCell>
                  <TableCell align="center"><Skeleton width={60} /></TableCell>
                  <TableCell align="center"><Skeleton width={70} /></TableCell>
                  <TableCell align="center"><Skeleton width={90} /></TableCell>
                  <TableCell align="center"><Skeleton width={40} height={40} /></TableCell>
                </TableRow>
              ))
            ) : (
              bookingsData?.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.user?.userName}</TableCell>
                    <TableCell>{booking.room?.roomNumber || "Deleted"}</TableCell>
                    <TableCell align="center">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">${booking.totalPrice}</TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: statusStyle.color,
                          backgroundColor: statusStyle.bg,
                          borderRadius: "8px",
                          padding: "4px 8px",
                          display: "inline-block",
                        }}
                      >
                        {booking.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={(e) => handleClick(e, booking._id)}>
                        <MoreVertIcon sx={{color:"#000"}} />
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuBookingId === booking._id}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={() => {
                          handleOpenModalView(booking._id);
                          handleClose();
                        }}>
                          <VisibilityIcon sx={{ mr: 1, color: "primary.main" }} />
                          View
                        </MenuItem>
                        <MenuItem onClick={() => {
                          handleOpenDelete(booking._id);
                          handleClose();
                        }}>
                          <DeleteIcon sx={{ mr: 1, color: "error.main" }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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
                onClick={() => fetchBookings(token, currentPage - 1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Prev
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchBookings(token, page)}
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
                onClick={() => fetchBookings(token, currentPage + 1)}
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