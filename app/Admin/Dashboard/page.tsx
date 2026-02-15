"use client"
import * as React from 'react';
import axios from "axios";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import { AUTH_ADMIN_ENDPOINTS } from '@/app/_Api/Api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function HomeAdmin() {
  const [dashboardData, setDashboardData] = React.useState<any>(null);

  const Submit = async () => {
    try {
      const response = await axios.get(AUTH_ADMIN_ENDPOINTS.CHART, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setDashboardData(response.data.data);
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

  React.useEffect(() => {
    Submit();
  }, []);



  const userAdminData = {
    labels: ['User', 'Admin'],
    datasets: [
      {
        label: 'Users and Admins',
        data: [300 , 131],
        backgroundColor: ['#22c55e', '#3b82f6'], 
        hoverBackgroundColor: ['#16a34a', '#2563eb'], 
      },
    ],
  };

  const userAdminOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

  const bookingData = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        label: 'Booking Status',
        data: [180, 50, 35, 90], 
        backgroundColor: ['#3b82f6', '#a855f7', 'orange', 'red'], 
        hoverBackgroundColor: ['#2563eb', '#9333ea', 'orange', 'red'], 
      },
    ],
  };

  const bookingOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
        },
      },
    },
  };

return (
  <>
    {/* ====== TOP CARDS ====== */}
    <div className="mt-20 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Rooms */}
      <div className="bg-gray-950 h-32 rounded text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {dashboardData ? dashboardData.rooms : "Loading..."}
          </h1>
          <h5>Rooms</h5>
        </div>
        <WorkOutlineIcon />
      </div>

      {/* Facilities */}
      <div className="bg-gray-950 h-32 rounded text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {dashboardData ? dashboardData.facilities : "Loading..."}
          </h1>
          <h5>Facilities</h5>
        </div>
        <WorkOutlineIcon />
      </div>

      {/* Ads */}
      <div className="bg-gray-950 h-32 rounded text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {dashboardData ? dashboardData.ads : "Loading..."}
          </h1>
          <h5>Ads</h5>
        </div>
        <WorkOutlineIcon />
      </div>

    </div>

    {/* ====== CHARTS ====== */}
    <div className="mt-14 px-5 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

      {/* Booking Chart */}
      <div className="max-w-xs mx-auto">
        <Doughnut data={bookingData} options={bookingOptions} />
      </div>

      {/* Users / Admin Chart */}
      <div className="max-w-xs mx-auto">
        <Doughnut data={userAdminData} options={userAdminOptions} />

        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <h4>User</h4>
            <span>
              {dashboardData ? dashboardData.users.user : "Loading..."}
            </span>
          </div>

          <div className="flex justify-between">
            <h4>Admin</h4>
            <span>
              {dashboardData ? dashboardData.users.admin : "Loading..."}
            </span>
          </div>
        </div>
      </div>

    </div>
  </>
);

}
