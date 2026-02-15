"use client";
import { ROOM_ADMIN_ENDPOINTS } from "@/app/_Api/Api";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  FormHelperText,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

interface CreateRoomRequest {
  roomNumber: string;
  imgs: File[];
  price: number;
  capacity: number;
  discount: number;
  facilities: string[];
}

interface Facilities {
  name: string;
  _id: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm<CreateRoomRequest>({
    defaultValues: {
      facilities: [],
      imgs: [],
    },
  });
  const router=useRouter()
  const [facilities, setfacilities] = useState<Facilities[]>([]);
  const [token, setToken] = useState<string | null>(null);
  // drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const createRoom = async (data: CreateRoomRequest) => {
    console.log("Submitting...", data);
    const formData = new FormData();

    formData.append("roomNumber", data.roomNumber);
    formData.append("price", data.price.toString());
    formData.append("capacity", data.capacity.toString());
    formData.append("discount", data.discount.toString());

    data.facilities.forEach((facility) => {
      formData.append("facilities[]", facility);
    });

    data.imgs.forEach((file) => {
      formData.append("imgs", file);
    });

    try {
      let res = await axios.post(ROOM_ADMIN_ENDPOINTS.createRooms, formData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(res);
      toast.success("Room created Successfully");
      reset(); // reset form after success
    } catch (error) {
      console.log(error);
      toast.error("Failed to create room");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    setToken(storedToken);
    facilitiesRoom(storedToken);
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(createRoom)}
    >
      <TextField
        label="Room Number"
        fullWidth
        sx={{ background: "rgba(247,247,247,1)" }}
        {...register("roomNumber", {
          required: "Room number is required",
        })}
        error={!!errors.roomNumber}
        helperText={errors.roomNumber?.message}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Price"
          fullWidth
          margin="normal"
          type="number"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
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

      <TextField
        label="Discount"
        fullWidth
        margin="normal"
        type="number"
        {...register("discount", {
          required: "Discount is required",
          min: { value: 0, message: "Discount must be positive" },
          max: { value: 100, message: "Discount cannot exceed 100%" },
        })}
        error={!!errors.discount}
        helperText={errors.discount?.message}
      />

      <FormControl fullWidth margin="normal" error={!!errors.facilities}>
        <InputLabel id="facilities-label">Facilities</InputLabel>
        <Controller
          name="facilities"
          control={control}
          rules={{ required: "Please select at least one facility" }}
          render={({ field }) => (
            <Select
              {...field}
              labelId="facilities-label"
              id="facilities-select"
              label="Facilities"
              multiple
              value={field.value || []}
            >
              {facilities.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.facilities && (
          <FormHelperText>{errors.facilities.message}</FormHelperText>
        )}
      </FormControl>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body2" sx={{ color: "#344767", fontWeight: 500 }}>
          Room Images
        </Typography>

        {/* منطقة رفع الصور - Drag & Drop */}
        <Controller
          name="imgs"
          control={control}
          rules={{
            required: "Please upload at least one image",
            validate: (files: File[]) => {
              if (!files || files.length === 0)
                return "Please upload at least one image";

              for (let file of files) {
                if (!file.type.startsWith("image/"))
                  return "Only image files are allowed";
                if (file.size > 5 * 1024 * 1024)
                  return "Each image must be less than 5MB";
              }

              return true;
            },
          }}
          render={({ field }) => {
            // ✅ إنشاء previews بدون memory leak
            useEffect(() => {
              if (!field.value || field.value.length === 0) {
                setPreviews([]);
                return;
              }

              const urls = field.value.map((file: File) =>
                URL.createObjectURL(file),
              );

              setPreviews(urls);

              return () => {
                urls.forEach((url) => URL.revokeObjectURL(url));
              };
            }, [field.value]);

            return (
              <>
                {/* Drop Zone */}
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: isDragging
                      ? "#7e57c2"
                      : field.value?.length
                        ? "#7e57c2"
                        : "#e0e0e0",
                    borderRadius: 3,
                    p: 4,
                    textAlign: "center",
                    bgcolor: isDragging
                      ? "#f3e8ff"
                      : field.value?.length
                        ? "#f5f0ff"
                        : "#fafafa",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);

                    const files = Array.from(e.dataTransfer.files).filter(
                      (file) => file.type.startsWith("image/"),
                    );

                    setValue("imgs", [...(field.value || []), ...files], {
                      shouldValidate: true,
                    });
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setValue("imgs", [...(field.value || []), ...files], {
                        shouldValidate: true,
                      });
                      e.target.value = "";
                    }}
                  />

                  <Typography fontWeight={600} color="#344767">
                    Drag & Drop images here
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    or click to browse (Max 5MB per image)
                  </Typography>
                </Box>

                {/* Preview Section */}
                {previews.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography fontWeight={600}>
                        Selected Images ({previews.length})
                      </Typography>

                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          setValue("imgs", [], { shouldValidate: true })
                        }
                      >
                        Clear All
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: 2,
                      }}
                    >
                      {previews.map((src, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            aspectRatio: "1/1",
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <img
                            src={src}
                            alt={`Preview ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                          {/* Delete single image */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              bgcolor: "rgba(0,0,0,0.6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "rgba(244,67,54,0.9)",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = field.value.filter(
                                (_: File, i: number) => i !== index,
                              );
                              setValue("imgs", updated, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <Typography sx={{ color: "white", fontSize: 14 }}>
                              ×
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {errors.imgs && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {errors.imgs.message}
                  </FormHelperText>
                )}
              </>
            );
          }}
        />
        {errors.imgs && (
          <FormHelperText error sx={{ mt: 1 }}>
            {errors.imgs.message}
          </FormHelperText>
        )}
      </Box>
      <Box sx={{display:'flex',justifyContent:'space-between'}}>
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 2 , bgcolor:"#3252DF"}}
      >
        {isSubmitting ? "Creating Room..." : "Create Room"}
      </Button>
      <Button
      onClick={()=>{
        router.back()
      }}
        sx={{ mt: 2 , borderColor:'#3252DF'}}
      >
        cancel
      </Button>
      </Box>
    </Box>
  );
}
