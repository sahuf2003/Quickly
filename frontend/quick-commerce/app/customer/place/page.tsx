"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { API_URL } from "./page";
export {API_URL} from '@/config/api'
interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

export default function PlaceOrderPage() {
  const authorized = useRoleProtection("Customer");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  // --- Initialize Socket.IO ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const role = localStorage.getItem('role');
    if(role!=='Customer') return;
    if (!socketRef.current) {
      socketRef.current = io(API_URL, {
        auth: { token },
        transports: ["polling", "websocket"],
      });

      socketRef.current.on("connect", () => console.log("✅ Socket connected:", socketRef.current?.id));
      socketRef.current.on("connect_error", (err) => console.error("Socket error:", err.message));
      socketRef.current.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  // --- Load cart ---
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed: CartItem[] = JSON.parse(savedCart);
      setCart(parsed);
      setAmount(parsed.reduce((sum, item) => sum + item.quantity * item.price, 0));
    }
  }, []);

  // --- Cart functions ---
  const increaseQuantity = (name: string) => {
    const updated = cart.map((item) =>
      item.name === name ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    updateAmount(updated);
  };

  const decreaseQuantity = (name: string) => {
    const updated = cart
      .map((item) => (item.name === name ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);
    setCart(updated);
    updateAmount(updated);
  };

  const removeItem = (name: string) => {
    const updated = cart.filter((item) => item.name !== name);
    setCart(updated);
    updateAmount(updated);
  };

  const updateAmount = (updatedCart: CartItem[]) => {
    setAmount(updatedCart.reduce((sum, item) => sum + item.quantity * item.price, 0));
  };

  // --- Place Order ---
  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first!");

    try {
      const payload = { Items: cart.map(({ name, quantity }) => ({ name, quantity })), Amount: amount };
      const res = await axios.post(`${API_URL}/customer/place`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Order Placed Successfully");

        socketRef.current?.emit("orderPlaced", res.data.order._id);

        setCart([]);
        setAmount(0);
        localStorage.removeItem("cart");

        router.push("/customer/order-status");
      }
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Place Order</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-4 space-y-2">
            {cart.map((item) => (
              <li key={item.name} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-500">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.name)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.name)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.name)}
                    className="px-2 py-1 text-red-500 font-bold rounded hover:bg-red-100"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mb-4 text-lg font-semibold">Total Amount: ₹{amount}</h3>
          <button
            onClick={placeOrder}
            disabled={cart.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm Order
          </button>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
