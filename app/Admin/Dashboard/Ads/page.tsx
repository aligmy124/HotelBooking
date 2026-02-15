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
import { ADS_ADMIN_ENDPOINTS, ROOM_ADMIN_ENDPOINTS } from "@/app/_Api/Api";
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
import { FormControl, Skeleton } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

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
interface Rooms {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  images: string[];
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}

interface adsProps {
  _id: string;
  isActive: boolean;
  room: Rooms;
  createdBy: {
    _id: string;
    userName: string;
  } | null;
}

interface EditAdsPayload {
  room: string;
  isActive: boolean;
  discount: number;
}

export default function AdsTable() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm<EditAdsPayload>({
    defaultValues: {
      room: "",
      discount: 0,
      isActive: true,
    },
  });

  // Modal Delete
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = (roomId: string) => {
    setOpenDelete(true);
    setSelectedId(roomId);
    console.log(roomId);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  // MUI Modal View
  const [openModalView, setOpenModalView] = useState(false);
  const handleOpenModalView = async (roomId: string) => {
    if (!roomId) return;
    setOpenModalView(true);
    setSelectedId(roomId);
    await ViewRoom(roomId);
  };
  const handleCloseModalView = () => setOpenModalView(false);
  // MUI Modal Edit
  const [selectedAd, setSelectedAd] = useState<adsProps | null>(null);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const handleOpenModalEdit = (roomId: string, ads: adsProps) => {
    if (!roomId) return;
    setOpenModalEdit(true);
    setSelectedId(roomId);
    setSelectedAd(ads);
    setValue("isActive", ads.isActive);
    setValue("discount", ads.room.discount);

    console.log(ads.isActive);
  };
  const handleCloseModalEdit = () => setOpenModalEdit(false);

  // MUI Modal CREATE
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const handleOpenModalCreate = async () => {
    reset({
      room: "",
      discount: 0,
      isActive: true,
    });
    setOpenModalCreate(true);
  };
  const handleCloseModalCreate = () => setOpenModalCreate(false);

  // Full Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAdId, setMenuAdId] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    roomId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuAdId(roomId);
    console.log(roomId);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuAdId(null);
  };
  const [adsData, setAdsData] = useState<adsProps[] | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  // pagination + fetch data
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const fetchAds = async (token: string | null, page: number) => {
    setLoading(true);
    try {
      let res = await axios.get(ADS_ADMIN_ENDPOINTS.getAds, {
        headers: { Authorization: `${token}` },
        params: { page, size: pageSize },
      });
      setAdsData(res.data.data.ads);
      console.log(res.data.data.ads);
      const totalcount = res.data.data.totalCount;
      setTotalPages(Math.ceil(totalcount / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Delete
  const deleteAds = async () => {
    if (!selectedId || !token) return;
    console.log(selectedId);
    try {
      let res = await axios.delete(
        ADS_ADMIN_ENDPOINTS.delete(selectedId as string),
        {
          headers: { Authorization: `${token}` },
        },
      );
      toast.success("Delete Successfully");
      fetchAds(token, 1);
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    }
  };
  // View
  const [roomView, setRoomView] = useState<adsProps | undefined>(undefined);
  const ViewRoom = async (roomId: string) => {
    if (!roomId || !token) return;
    setLoading(true);
    try {
      let res = await axios.get(ADS_ADMIN_ENDPOINTS.view(roomId), {
        headers: { Authorization: `${token}` },
      });
      console.log(res.data.data.ads);
      setRoomView(res.data.data.ads);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const editAds = async (data: EditAdsPayload) => {
    console.log("Form submitted", data);
    if (!selectedId || !token || !selectedAd) return;

    try {
      await axios.put(
        ADS_ADMIN_ENDPOINTS.update(selectedId),
        {
          isActive: Boolean(data.isActive),
          discount: Number(data.discount),
        },
        { headers: { Authorization: token } },
      );
      toast.success("Ads updated successfully");
      handleCloseModalEdit();
      fetchAds(token, currentPage);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Ads update failed");
    }
  };
  // create
  const [roomsList, setRoomsList] = useState<Rooms[]>([]);
  const fetchRooms = async (token: string) => {
    try {
      const res = await axios.get(ROOM_ADMIN_ENDPOINTS.getRooms, {
        headers: { Authorization: token },
      });
      setRoomsList(res.data.data.rooms);
    } catch (error) {
      console.log(error);
    }
  };

  const CreateAds = async (data: EditAdsPayload) => {
    console.log("data created: ", data);
    if (!token) return;

    // تأكد من شكل البيانات المطلوب
    const payload = {
      room: data.room,
      discount: Number(data.discount),
      isActive: Boolean(data.isActive),
    };

    try {
      await axios.post(ADS_ADMIN_ENDPOINTS.createAds, payload, {
        headers: { Authorization: token },
      });
      toast.success("Ads created successfully");
      handleCloseModalCreate();
      fetchAds(token, currentPage);
      reset(); // امسح البيانات بعد النجاح
    } catch (error: any) {
      console.log("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Ads creation failed");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    setToken(storedToken);
    fetchAds(storedToken, 1);
    fetchRooms(storedToken);
  }, []);

  return (
    <>
      {/* delete modal */}
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
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
              onClick={handleCloseDelete}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteAds();
                handleCloseDelete();
              }}
              variant="contained"
              color="error"
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
              src={roomView?.room.images[0] || viewImg}
              alt={roomView?.room.roomNumber || "room image"}
              width={180}
              height={180}
              className="object-cover rounded-lg shadow-md"
            />
            {/* اسم الغرفة */}
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {roomView?.room.roomNumber}
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
                <span style={{ fontWeight: "bold" }}>
                  ${roomView?.room.price}
                </span>
              </Typography>
              <Typography sx={{ color: "#555", fontWeight: "500" }}>
                Discount:{" "}
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {roomView?.room.discount}%
                </span>
              </Typography>
            </Box>

            {/* السعة */}
            <Typography sx={{ color: "#555", fontWeight: "500" }}>
              Capacity:{" "}
              <span style={{ fontWeight: "bold" }}>
                {roomView?.room.capacity} person
              </span>
            </Typography>
            <Typography sx={{ color: "#555", fontWeight: "500" }}>
              status:{" "}
              <span style={{ fontWeight: "bold" }}>
                {roomView?.isActive ? "Yes" : "No"}
              </span>
            </Typography>
            <Typography sx={{ color: "#555", fontWeight: "500" }}>
              Created By:{" "}
              <span style={{ fontWeight: "bold" }}>
                {roomView?.createdBy?.userName}
              </span>
            </Typography>
            <Typography sx={{ color: "#555", fontWeight: "500" }}>
              created At:{" "}
              <span style={{ fontWeight: "bold" }}>
                {new Date(roomView?.room.createdAt || "").toLocaleDateString()}
              </span>
            </Typography>
          </Box>
        )}
      </Modal>
      {/* Edit Modal */}
      <Modal open={openModalEdit} onClose={handleCloseModalEdit}>
        <Box
          component="form"
          sx={{
            ...styleModal,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
          onSubmit={handleSubmit(editAds)}
        >
          {/* Room Name (Read Only) */}
          <TextField
            label="Room Number"
            value={selectedAd?.room.roomNumber || ""}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />

          {/* Discount */}
          <TextField
            label="Discount"
            type="number"
            fullWidth
            {...register("discount", {
              required: "Discount is required",
              min: 0,
            })}
            error={!!errors.discount}
            helperText={errors.discount?.message}
          />
          {/* Status */}
          <Controller
            name="isActive"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  {...field}
                  label="Status"
                  // خلى القيمة boolean مباشرة
                  value={field.value ?? false}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">unActive</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Modal>
      {/* create */}
      <Modal open={openModalCreate} onClose={handleCloseModalCreate}>
        <Box
          component="form"
          onSubmit={handleSubmit(CreateAds)} // ✅ مهم جداً
          sx={{
            ...styleModal,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Room Select */}
          <Controller
            name="room"
            control={control}
            rules={{ required: "Room is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.room}>
                <InputLabel>Room</InputLabel>
                <Select {...field} label="Room">
                  {roomsList.map((room) => (
                    <MenuItem key={room._id} value={room._id}>
                      {room.roomNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Discount */}
          <TextField
            label="Discount"
            type="number"
            fullWidth
            {...register("discount", {
              required: "Discount is required",
              min: 0,
            })}
            error={!!errors.discount}
            helperText={errors.discount?.message}
          />

          {/* Status */}
          <Controller
            name="isActive"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={field.value ? "true" : "false"}
                  label="Status"
                  onChange={(e) => field.onChange(e.target.value === "true")}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">UnActive</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mx: 2, background: "#2563eb" }}
          >
            Create Ads
          </Button>
        </Box>
      </Modal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3, // مسافة أكبر عن الجدول
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "500",
              color: "#rgba(31, 38, 62, 1)",
              fontSize: "20px",
            }}
          >
            Ads Table Details
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "400",
              color: "#rgba(31, 38, 62, 1)",
              fontSize: "14px",
            }}
          >
            You can check all details
          </Typography>
        </Box>
        <Button
          onClick={handleOpenModalCreate}
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
          Add New Ads
        </Button>
      </Box>

      {/* table */}
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow sx={{ background: "rgba(226, 229, 235, 1)" }}>
        <TableCell>room Name</TableCell>
        <TableCell align="center">createdAt</TableCell>
        <TableCell align="center">createdBy</TableCell>
        <TableCell align="center">Active</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {loading
        ? Array.from({ length: pageSize }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Skeleton variant="text" width={120} height={20} />
                  <Skeleton variant="text" width={90} height={20} />
                  <Skeleton variant="text" width={70} height={20} />
                  <Skeleton variant="text" width={80} height={20} />
                </Box>
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={80} height={20} sx={{ margin: "0 auto" }} />
              </TableCell>
              <TableCell align="center">
                <Skeleton variant="text" width={100} height={20} sx={{ margin: "0 auto" }} />
              </TableCell>
              <TableCell align="center">
                <Skeleton 
                  variant="rounded" 
                  width={60} 
                  height={30} 
                  sx={{ 
                    margin: "0 auto",
                    borderRadius: "8px"
                  }} 
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Skeleton 
                    variant="circular" 
                    width={32} 
                    height={32} 
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))
        : adsData?.map((row) => (
            <TableRow
              key={row?.room._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <ul style={{ listStyleType: "disc" }}>
                  <li>Room Number: {row?.room.roomNumber}</li>
                  <li>Price: ${row?.room.price}</li>
                  <li>Discount: {row?.room.discount}%</li>
                  <li>Capacity: {row?.room.capacity}</li>
                </ul>
              </TableCell>
              <TableCell align="center">
                {new Date(row.room.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell align="center">
                {row?.createdBy?.userName}
              </TableCell>
              <TableCell align="center">
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: row?.isActive ? "green" : "red",
                    backgroundColor: row?.isActive
                      ? "rgba(144, 238, 144, 0.2)"
                      : "rgba(255, 99, 71, 0.2)",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    display: "inline-block",
                    minWidth: "40px",
                  }}
                >
                  {row?.isActive ? "Yes" : "No"}
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Button onClick={(e) => handleClick(e, row?.room._id)}>
                  <MoreVertIcon style={{ color: "#000" }} />
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuAdId === row?.room?._id}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleOpenModalView(row?._id);
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
                      handleOpenDelete(row?._id);
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
                onClick={() => fetchAds(token, currentPage - 1)}
                className="cursor-pointer rounded-full border border-[#3252DF] py-2 px-3 text-sm transition-all shadow-sm text-slate-600 hover:text-white hover:bg-[#3252DF] hover:border-slate-800"
              >
                Prev
              </button>
            )}

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchAds(token, page)}
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
                onClick={() => fetchAds(token, currentPage + 1)}
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
