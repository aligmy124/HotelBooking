import React from "react"
import Box from "@mui/material/Box"
interface AuthComponentProps {
  form: React.ReactNode
  image: string
  imgHeader: string
  imgText: string
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  form,
  image,
  imgHeader,
  imgText,
}) => {
  return (
    <div className="flex flex-wrap">
      {/* القسم الأيسر - الفورم */}
      <div className="w-full md:w-1/2 relative">
        <div className="pt-5 px-4 md:ps-10 ">
          <h2 className="text-3xl mb-3 font-bold"><span className="text-[#3252DF]">Stay</span>cation</h2>
          <div>{form}</div>
        </div>
      </div>

      {/* القسم الأيمن - الصورة */}
      <div className="w-full md:w-1/2">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            blockSize: "100vh",
            minHeight: "100%",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <img src={image} alt="login" className="h-full w-full p-5" />
          <div className="absolute z-20 bottom-20 left-20 text-white">
            <h3 className="text-4xl font-extrabold">{imgHeader}</h3>
            <p className="text-xl">{imgText}</p>
          </div>
        </Box>
      </div>
    </div>
  )
}

export default AuthComponent