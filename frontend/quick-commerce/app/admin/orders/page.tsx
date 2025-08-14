'use client';

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { API_URL } from "@/config/api";

interface OrderStatus {
  orderId: string;
  status: string;
  partnerId?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const authorized = useRoleProtection("Admin"); 
  const [orders, setOrders] = useState<OrderStatus[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const getStatusFromOrder = (orderStatus: any) => {
    if (orderStatus.Delivered) return "Delivered";
    if (orderStatus.OntheWay) return "On the way";
    if (orderStatus.Picked) return "Picked up";
    return "Placed";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Picked up":
        return "bg-purple-100 text-purple-800";
      case "On the way":
        return "bg-yellow-100 text-yellow-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Accepted by partner":
        return "bg-indigo-100 text-indigo-800";
      case "Locked":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(API_URL, {
        auth: { token },
        transports: ["websocket"],
        autoConnect: false,
      });
    }

    const socket = socketRef.current;
    socket.connect();

    // Join admins room
    socket.emit("joinAdminsRoom", token);

    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const initialOrders: OrderStatus[] = res.data.orders.map((order: any) => ({
          orderId: order._id,
          status: getStatusFromOrder(order.OrderStatus),
          partnerId: order.partnerId || undefined,
          createdAt: order.createdAt,
        }));

        setOrders(initialOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();

    // ----------------- SOCKET LISTENERS -----------------
    const handleNewOrder = (order: any) => {
      setOrders(prev => [
        ...prev,
        {
          orderId: order._id,
          status: getStatusFromOrder(order.OrderStatus),
          partnerId: order.partnerId || undefined,
          createdAt: order.createdAt,
        }
      ]);
      toast.info(`New order received: ${order._id}`);
    };

    const handleOrderLocked = ({ orderId, partnerId }: { orderId: string, partnerId: string }) => {
      setOrders(prev =>
        prev.map(o => o.orderId === orderId ? { ...o, status: "Locked", partnerId } : o)
      );
      toast.warning(`Order ${orderId} locked by partner ${partnerId}`);
    };

    const handleOrderStatusUpdated = (order: any) => {
      setOrders(prev =>
        prev.map(o =>
          o.orderId === order._id
            ? { ...o, status: getStatusFromOrder(order.OrderStatus), partnerId: order.partnerId }
            : o
        )
      );
      toast.success(`Order ${order._id} status updated`);
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderLocked", handleOrderLocked);
    socket.on("orderStatusUpdated", handleOrderStatusUpdated);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderLocked", handleOrderLocked);
      socket.off("orderStatusUpdated", handleOrderStatusUpdated);
      socket.disconnect();
    };
  }, [authorized]);

  if (!authorized) return <p>Checking authorization...</p>;

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">All Orders</h1>
      {orders.length > 0 ? (
        orders.map(order => (
          <div
            key={order.orderId}
            className="mb-4 p-4 bg-white rounded-lg shadow border border-purple-200 hover:shadow-md transition"
          >
            <p className="font-semibold text-purple-800 mb-2">Order ID: {order.orderId}</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}
            >
              {order.status}
            </span>
            {order.partnerId && <p className="text-gray-500 mt-2">Partner: {order.partnerId}</p>}
            <p className="text-gray-400 text-sm mt-1">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No orders yet.</p>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
