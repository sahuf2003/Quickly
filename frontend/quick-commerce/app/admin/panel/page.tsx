"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { API_URL } from "@/config/api";

export default function AdminSystemStatusPage() {
  const authorized = useRoleProtection("Admin");
  const router = useRouter();
  const [status, setStatus] = useState<"up" | "down" | "loading">("loading");

  const checkHealth = async () => {
    setStatus("loading");
    try {
      const res = await axios.get(`${API_URL}/health`);
      if (res.data.success) setStatus("up");
      else setStatus("down");
    } catch (err) {
      setStatus("down");
    }
  };

  useEffect(() => {
    if (authorized) checkHealth();
  }, [authorized]);

  if (!authorized) return <p>Checking authorization...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 relative">
      {/* Top-right manual check button */}
      <button
        onClick={checkHealth}
        className="absolute top-6 right-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Check API
      </button>

      <h1 className="text-3xl font-bold text-gray-800">System Status</h1>

      <div className="flex flex-col items-center gap-3 mt-4">
        <span
          className={`w-6 h-6 rounded-full ${
            status === "up"
              ? "bg-green-500"
              : status === "down"
              ? "bg-red-500"
              : "bg-gray-300 animate-pulse"
          }`}
        ></span>
        <p className="text-lg font-semibold">
          {status === "loading"
            ? "Checking..."
            : status === "up"
            ? "System is Up"
            : "System is Down"}
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push("/admin/orders")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Go to Orders
        </button>
        <button
          onClick={() => router.push("/admin/partners")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Partners
        </button>
      </div>
    </div>
  );
}
