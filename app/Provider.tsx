
import React from "react";
import { ToastContainer } from 'react-toastify';
import { useAuth } from "./_Context/Authentication";
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">{children}</main>
       <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
    </div>
  )
}

