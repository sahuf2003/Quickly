"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { API_URL } from "@/config/api";

interface Partner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string;
  createdAt: string;
}

export default function AdminPartnersPage() {
  const authorized = useRoleProtection("Admin"); 
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
    const role = localStorage.getItem('role');
    if(role!=='Admin') return;
        const res = await axios.get(`${API_URL}/admin/getPartners`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPartners(res.data.partners);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch partners");
      } finally {
        setLoading(false);
      }
    };

    if (authorized) fetchPartners();
  }, [authorized]);

  if (!authorized) return <p>Checking authorization...</p>;

  if (loading) return <p>Loading partners...</p>;

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">All Partners</h1>
      {partners.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="p-4 bg-white rounded-lg shadow border border-purple-200 hover:shadow-md transition"
            >
              <p className="font-semibold text-purple-800 mb-1">
                {partner.firstName} {partner.lastName}
              </p>
              <p className="text-gray-600 mb-1">Email: {partner.email}</p>
              <p className="text-gray-400 text-sm mt-1">
                Joined: {new Date(partner.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No partners found.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
