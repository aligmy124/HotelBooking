"use client";

import { PORTAL_AUTH_ENDPOINTS } from "@/app/_Api/Api";
import Loading from "@/app/_Shared/_Loading/Loading";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  ShieldX, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  MapPin,
  Clock,
  User,
  BadgeCheck,
  LogOut
} from "lucide-react";

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

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<PropsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;

    const getProfile = async () => {
      try {
        const res = await axios.get(
          PORTAL_AUTH_ENDPOINTS.PROFILE(id as string),
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
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information</p>
          </div>

        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Cover Image with Gradient */}
          <div className="relative h-48 bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                user.verified 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.verified ? 'Verified Account' : 'Pending Verification'}
              </span>
            </div>
            
            {/* Profile Image */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.userName}
                      width={140}
                      height={140}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {getInitials(user.userName)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {user.userName}
                  {user.verified && (
                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                  )}
                </h2>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <span className="capitalize px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    {user.country}
                  </span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(user.createdAt).split(',')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "activity"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Address"
                  value={user.email}
                  subValue="Primary email"
                  color="blue"
                />
                
                <InfoCard
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone Number"
                  value={`0${user.phoneNumber}`}
                  subValue="Mobile"
                  color="green"
                />
                
                <InfoCard
                  icon={<Globe className="w-5 h-5" />}
                  label="Country / Region"
                  value={user.country}
                  subValue="Location"
                  color="purple"
                />
                
                <InfoCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Account Created"
                  value={formatDate(user.createdAt)}
                  subValue={`Last updated: ${formatDate(user.updatedAt)}`}
                  color="orange"
                />
              </div>
            )}

            {activeTab === "activity" && (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  subValue,
  color = "indigo"
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color?: "blue" | "green" | "purple" | "orange" | "indigo";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600"
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-gray-50 to-transparent rounded-bl-3xl -z-10"></div>
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {value}
          </p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
      </div>
      
      {/* Decorative Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl bg-linear-to-r from-${color}-500 to-transparent`}></div>
    </div>
  );
}