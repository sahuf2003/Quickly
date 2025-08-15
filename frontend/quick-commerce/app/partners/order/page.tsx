"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/config/api";

// --- Types ---
interface OrderStatus {
  Picked?: boolean;
  OntheWay?: boolean;
  Delivered?: boolean;
}

interface Order {
  _id: string;
  locked?: boolean;
  partnerId?: string | null;
  OrderStatus: OrderStatus;
}

interface OrderLockedPayload {
  orderId: string;
  partnerId: string;
}

interface OrderLockedSelfPayload {
  order: Order;
}

interface UpdateOrderStatusPayload {
  orderId: string;
  status: Partial<OrderStatus>;
  token: string;
}

// interface YourOrdersPayload {
//   orders: Order[];
// }

// --- Component ---
export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const getStatus = (status: OrderStatus) => {
    if (status.Delivered) return "Delivered";
    if (status.OntheWay) return "On the Way";
    if (status.Picked) return "Picked";
    return "Placed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-blue-500";
      case "On the Way":
        return "bg-orange-500";
      case "Picked":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  // --- Socket.IO Initialization ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Decode partnerId from JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setPartnerId(payload._id);
    } catch {
      toast.error("Invalid token");
      return;
    }

    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        path:"/mysocket/",
        auth: { token },
        transports: ["polling", "websocket"],
        autoConnect: false,
      });

      socketRef.current = socket;
      socket.connect();

      socket.on("connect", () => {
        console.log("✅ Partner socket connected:", socket.id);
        socket.emit("joinPartnersRoom", token);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // Initial orders for this partner
      socket.on("yourOrders", (ordersFromServer: Order[]) => {
        const filtered = ordersFromServer.filter((o) => !o.OrderStatus?.Delivered);
        setOrders(filtered);
      });

      // New order placed
      socket.on("newOrder", (order: Order) => {
        if (!order.OrderStatus?.Delivered) {
          setOrders((prev) => [...prev, order]);
          toast.info(`New order received: ${order._id}`);
        }
      });

      // Order locked by any partner
      socket.on("orderLocked", ({ orderId, partnerId: lockerId }: OrderLockedPayload) => {
        if (lockerId === partnerId) {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, locked: true, partnerId: lockerId } : o))
          );
        } else {
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          toast.info(`Order ${orderId} locked by another partner`);
        }
      });

      // Order locked by self
      socket.on("orderLockedSelf", ({ order }: OrderLockedSelfPayload) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, locked: true } : o))
        );
        toast.success(`You locked order ${order._id}`);
      });

      // Status updated
      socket.on("orderStatusUpdated", (order: Order) => {
        if (order.OrderStatus.Delivered) {
          setOrders((prev) => prev.filter((o) => o._id !== order._id));
          toast.success(`Order ${order._id} delivered`);
        } else {
          setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
          toast.success(
            `Order ${order._id} status updated to ${getStatus(order.OrderStatus)}`
          );
        }
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [partnerId]);

  // --- Lock order ---
  const lockOrder = (orderId: string) => {
    if (!socketRef.current || !partnerId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    socketRef.current.emit("lockOrder", { orderId, token });

    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, partnerId, locked: true } : o))
    );
  };

  // --- Update order status ---
  const updateStatus = (orderId: string, key: keyof OrderStatus) => {
    if (!socketRef.current) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload: UpdateOrderStatusPayload = { orderId, status: { [key]: true }, token };
    socketRef.current.emit("updateOrderStatus", payload);
  };

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Partner Orders</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length > 0 ? (
          orders.map((order) => {
            const status = getStatus(order.OrderStatus);
            return (
              <div
                key={order._id}
                className="p-4 bg-white rounded-lg shadow border border-purple-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-purple-800">Order ID: {order._id}</p>
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></span>
                </div>
                <p className="text-gray-600 mb-2">Status: {status}</p>
                {order.partnerId && (
                  <p className="text-gray-500 mb-2">
                    Accepted by: {order.partnerId === partnerId ? "You" : order.partnerId}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {!order.partnerId && (
                    <button
                      className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      onClick={() => lockOrder(order._id)}
                    >
                      Lock Order
                    </button>
                  )}

                  {order.partnerId && !order.OrderStatus.Picked && (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => updateStatus(order._id, "Picked")}
                      disabled={order.partnerId !== partnerId}
                    >
                      Picked
                    </button>
                  )}
                  {order.OrderStatus.Picked && !order.OrderStatus.OntheWay && (
                    <button
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                      onClick={() => updateStatus(order._id, "OntheWay")}
                      disabled={order.partnerId !== partnerId}
                    >
                      On The Way
                    </button>
                  )}
                  {order.OrderStatus.Picked && order.OrderStatus.OntheWay && !order.OrderStatus.Delivered && (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => updateStatus(order._id, "Delivered")}
                      disabled={order.partnerId !== partnerId}
                    >
                      Delivered
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No orders yet.</p>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
