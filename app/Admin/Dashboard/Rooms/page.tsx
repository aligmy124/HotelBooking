"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";
import { ROOM_ADMIN_ENDPOINTS } from "@/app/_Api/Api";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  Modal,
  Skeleton,
  TextField,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import delImg from "./../../../../assets/images/Email.png";
import viewImg from "./../../../../assets/images/pic (2).png";
import Loading from "@/app/_Shared/_Loading/Loading";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
// interface

interface Rooms {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: {
    _id: string;
    name: string;
  };
  createdBy: {
    _id: string;
    userName: string;
  };
  images: string[];
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}
interface RoomView {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: {
    _id: string;
    name: string;
  };
  createdBy: {
    _id: string;
    userName: string;
  };
  images: string[];
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}
interface Facilities {
  name: string;
  _id: string;
}
interface UpdateRoom {
  // ✅ مش محتاج imgs هنا لاننا بنستخدم FormData
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: string[];
}

export default function CustomizedTables() {
  // MUI Table
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRoomId, setMenuRoomId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const router = useRouter();

  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    roomId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRoomId(roomId);
    console.log(roomId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuRoomId(null);
  };
  // MUI Modal Delete
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (id: string) => {
    setOpenModal(true);
    setSelectedRoomId(id);
    console.log(id);
  };
  const handleCloseModal = () => setOpenModal(false);
  // MUI Modal View
  const [openModalView, setOpenModalView] = useState(false);
  const handleOpenModalView = (id: string) => {
    if (!id) return;
    setOpenModalView(true);
    setSelectedRoomId(id);
    ViewRoom(id);
  };
  const handleCloseModalView = () => setOpenModalView(false);
  // Modal Edit
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<UpdateRoom>();
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const handleOpenModalEdit = (id: string, roomData: Rooms) => {
    if (!id) return;
    setSelectedRoomId(id);

    // ✅ بس البيانات النصية
    setValue("roomNumber", roomData.roomNumber);
    setValue("capacity", roomData.capacity);
    setValue("price", roomData.price);
    setValue("discount", roomData.discount);
    setValue(
      "facilities",
      roomData.facilities
        ? Array.isArray(roomData.facilities)
          ? roomData.facilities.map((f) => f._id)
          : [roomData.facilities._id]
        : [],
    );

    setOpenModalEdit(true);
  };
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
  };
  // Mui
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
  // project
  const [rooms, setRooms] = useState<Rooms[] | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  // fetchData
  const fetchRooms = async (token: string | null, page: number) => {
    setLoading(true);
    try {
      let res = await axios.get(ROOM_ADMIN_ENDPOINTS.getRooms, {
        headers: { Authorization: `${token}` },
        params: { page, size: pageSize },
      });
      setRooms(res.data.data.rooms);
      const totalcount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalcount / pageSize));
      setCurrentPage(page);
      console.log(res.data.data.rooms);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // get facility
  const [facilities, setfacilities] = useState<Facilities[]>([]);
  const [selectedfacilities, setSelectedfacilities] = useState<string[]>([]);
  const handlefacilitiesChange = (
    event: SelectChangeEvent<string[] | string>,
  ) => {
    const value = event.target.value;
    setSelectedfacilities(typeof value === "string" ? value.split(",") : value);
  };
  const facilitiesRoom = async (token: string) => {
    try {
      let res = await axios.get(ROOM_ADMIN_ENDPOINTS.facility, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setfacilities(res.data.data.facilities);
    } catch (error) {
      console.log(error);
    }
  };
  // Delete
  const deleteRoom = async () => {
    if (!selectedRoomId || !token) return;
    console.log(selectedRoomId);
    try {
      const res = await axios.delete(
        ROOM_ADMIN_ENDPOINTS.delete(selectedRoomId as string),
        {
          headers: { Authorization: `${token}` },
        },
      );
      fetchRooms(token, currentPage);
      toast.success("Delete Successfully");
    } catch (error) {
      console.log(error);
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    }
  };
  // View
  const [roomView, setRoomView] = useState<RoomView | undefined>(undefined);
  const ViewRoom = async (id: string) => {
    setLoading(true);
    try {
      let res = await axios.get(ROOM_ADMIN_ENDPOINTS.view(id), {
        headers: { Authorization: `${token}` },
      });
      setRoomView(res.data.data.room);
      console.log(res.data.data.room);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Edit
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);

  const editRoom = async (data: UpdateRoom) => {
    if (!selectedRoomId || !token) return;

    const formData = new FormData();

    // ❌ شيل جزء الصور خالص
    // ✅ الحقول النصية بس
    formData.append("roomNumber", data.roomNumber);
    formData.append("price", String(data.price));
    formData.append("capacity", String(data.capacity));
    formData.append("discount", String(data.discount ?? 0));

    // ✅ المرافق
    if (Array.isArray(data.facilities)) {
      data.facilities.forEach((facility) => {
        formData.append("facilities", facility);
      });
    }

    try {
      const response = await axios.put(
        ROOM_ADMIN_ENDPOINTS.edit(selectedRoomId),
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      console.log("✅ Success:", response.data);
      toast.success("Room updated successfully");
      handleCloseModalEdit();
      fetchRooms(token, currentPage);
    } catch (error: any) {
      console.error("❌ Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    setToken(storedToken);
    fetchRooms(storedToken, 1);
    facilitiesRoom(storedToken);
  }, []);

  return (
    <>
      {/* Modal Delete */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={styleModal}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: "15px", // مسافة بين العناصر
          }}
        >
          <Image
            src={delImg}
            alt="Delete Image"
            width={120} // حجم أكبر قليلًا
            height={120}
            className="object-cover rounded-full" // شكل دائري للصورة
          />

          <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
            Delete This Ads Room?
          </Typography>

          <Typography sx={{ mt: 1, color: "#555" }}>
            Are you sure you want to delete this item?
            <br />
            If you are sure, just click on delete.
          </Typography>

          <Box sx={{ mt: 2, display: "flex", gap: "15px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                await deleteRoom();
                handleCloseModal();
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal View */}
      <Modal
        open={openModalView}
        onClose={handleCloseModalView}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: "20px",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              maxWidth: "400px",
            }}
          >
            {/* صورة الغرفة */}
            <Image
              src={roomView?.images[0] || viewImg}
              alt={roomView?.roomNumber || "room image"}
              width={180}
              height={180}
              className="object-cover rounded-lg shadow-md"
            />
            {/* اسم الغرفة */}
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {roomView?.roomNumber}
            </Typography>

            {/* معلومات الأسعار والخصم */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingX: 2,
              }}
            >
              <Typography sx={{ color: "#555", fontWeight: "500" }}>
                Price:{" "}
                <span style={{ fontWeight: "bold" }}>${roomView?.price}</span>
              </Typography>
              <Typography sx={{ color: "#555", fontWeight: "500" }}>
                Discount:{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {roomView?.discount}%
                </span>
              </Typography>
            </Box>

            {/* السعة */}
            <Typography sx={{ color: "#555", fontWeight: "500" }}>
              Capacity:{" "}
              <span style={{ fontWeight: "bold" }}>
                {roomView?.capacity} person
              </span>
            </Typography>

            {/* المرافق (لو موجودة) */}
            {roomView?.facilities?.name && (
              <Typography sx={{ color: "#777", fontSize: "0.9rem" }}>
                Facility: {roomView.facilities.name}
              </Typography>
            )}
          </Box>
        )}
      </Modal>

      {/* modal Edit */}

      <Modal
        open={openModalEdit}
        onClose={handleCloseModalEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit(editRoom)}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 7,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 2,
          }}
        >
          {/* Room Number */}
          <TextField
            label="Room Number"
            fullWidth
            sx={{ background: "rgba(247,247,247,1)" }}
            {...register("roomNumber", {
              required: "Room Number is Required",
            })}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber?.message}
          />

          {/* Price & Capacity */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Price"
              fullWidth
              margin="normal"
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Capacity"
              fullWidth
              margin="normal"
              type="number"
              {...register("capacity", {
                required: "Capacity is required",
                min: { value: 1, message: "Capacity must be at least 1" },
              })}
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
            />
          </Box>

          {/* Discount */}
          <TextField
            label="Discount"
            fullWidth
            margin="normal"
            type="number"
            {...register("discount", {
              min: { value: 0, message: "Discount cannot be negative" },
              max: { value: 100, message: "Discount cannot exceed 100%" },
            })}
            error={!!errors.discount}
            helperText={errors.discount?.message}
          />

          {/* Facilities */}
          <FormControl fullWidth margin="normal" error={!!errors.facilities}>
            <InputLabel id="facilities-label">Facilities</InputLabel>
            <Controller
              name="facilities"
              control={control}
              defaultValue={[]}
              rules={{ required: "Facilities are required" }}
              render={({ field }) => (
                <Select
                  labelId="facilities-label"
                  label="Facilities"
                  multiple
                  {...field}
                  onChange={(event) => field.onChange(event.target.value)}
                  renderValue={(selected) => {
                    if (!Array.isArray(selected)) return "";
                    const names = facilities
                      .filter((f) => selected.includes(f._id))
                      .map((f) => f.name);
                    return names.join(", ");
                  }}
                >
                  {facilities?.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.facilities && (
              <Typography variant="caption" color="error">
                {errors.facilities.message}
              </Typography>
            )}
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Modal>

      {/* header */}
      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center", // مهم جداً
    mb: 3, // نفس المسافة
  }}
>
  <Box>
    <Typography
      variant="h6"
      sx={{
        fontWeight: "500",
        color: "rgba(31, 38, 62, 1)", // شيل # من rgba
        fontSize: "20px",
      }}
    >
      Rooms Table Details
    </Typography>

    <Typography
      variant="h6"
      sx={{
        fontWeight: "400",
        color: "rgba(31, 38, 62, 1)",
        fontSize: "14px",
      }}
    >
      You can check all details
    </Typography>
  </Box>

  <Button
    onClick={() => router.push("/Admin/Dashboard/Rooms/CreateRoom")}
    sx={{
      mx: 2,
      backgroundColor: "#2563eb",
      color: "white",
      fontWeight: "bold",
      textTransform: "none",
      borderRadius: "8px",
      padding: "6px 40px",
      boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#1e40af",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
    }}
  >
    Add New Room
  </Button>
</Box>


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow style={{ backgroundColor: "rgba(226, 229, 235, 1)" }}>
              <TableCell>room Number</TableCell>
              <TableCell align="center">image</TableCell>
              <TableCell align="center">price</TableCell>
              <TableCell align="center">discount</TableCell>
              <TableCell align="center">capacity</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ?
               Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" width={50} height={50} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width={40} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width={40} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width={40} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={24} height={24} />
                    </TableCell>
                  </TableRow>
                ))
              : rooms?.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row">
                      {row.roomNumber}
                    </TableCell>
                    <TableCell align="center">
                      <Image
                        src={row.images[0]}
                        width={50}
                        height={50}
                        alt={row.roomNumber}
                        className="object-cover mx-auto"
                      />
                    </TableCell>
                    <TableCell align="center">{row.price}</TableCell>
                    <TableCell align="center">{row.discount}</TableCell>
                    <TableCell align="center">{row.capacity}</TableCell>
                    <TableCell align="center">
                      <Button onClick={(e) => handleClick(e, row._id)}>
                        <MoreVertIcon style={{ color: "#000" }} />
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuRoomId === row._id}
                        onClose={handleClose}
                        slotProps={{
                          list: {
                            "aria-labelledby": "basic-button",
                          },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleOpenModalView(row._id);
                            handleClose();
                          }}
                        >
                          <VisibilityIcon
                            style={{
                              marginRight: "5px",
                              color: "rgba(32, 63, 199, 1)",
                            }}
                          />
                          View
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleOpenModalEdit(row._id, row);
                            handleClose();
                          }}
                        >
                          <EditIcon
                            style={{
                              marginRight: "5px",
                              color: "rgba(32, 63, 199, 1)",
                            }}
                          />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleOpenModal(row._id);
                            handleClose();
                          }}
                        >
                          <DeleteIcon
                            style={{
                              marginRight: "5px",
                              color: "rgba(32, 63, 199, 1)",
                            }}
                          />
                          Delete
                        </MenuItem>
                      </Menu>
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
                onClick={() => fetchRooms(token, currentPage - 1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Prev
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchRooms(token, page)}
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
                onClick={() => fetchRooms(token, currentPage + 1)}
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
