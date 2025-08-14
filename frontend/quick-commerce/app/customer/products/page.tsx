"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductCataloguePage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);



  const products: Product[] = [
    { id: 1, name: "Salt", price: 20, image: "https://m.media-amazon.com/images/I/614mm2hYHyL.jpg" },
    { id: 2, name: "Sugar", price: 40, image: "https://m.media-amazon.com/images/I/61+Zq4NHMNL.jpg" },
    { id: 3, name: "Rice", price: 60, image: "https://m.media-amazon.com/images/I/81mHz4XKK0L.jpg" },
    { id: 4, name: "Milk", price: 50, image: "https://m.media-amazon.com/images/I/812816L+HkL.jpg" },
    { id: 5, name: "Bread", price: 30, image: "https://www.jiomart.com/images/product/original/490626261/wibs-large-bread-400-g-product-images-o490626261-p490626261-0-202204092013.jpg?im=Resize=(1000,1000)" },
    { id: 6, name: "Eggs", price: 80, image: "https://m.media-amazon.com/images/I/31vKWEGCKzL._UF894,1000_QL80_.jpg" },
    { id: 7, name: "Butter", price: 120, image: "https://m.media-amazon.com/images/S/aplus-media/sota/95d868ed-6acd-4efc-990f-ee892ff3118d.__CR0,0,970,600_PT0_SX970_V1___.jpg" },
    { id: 8, name: "Tea", price: 70, image: "https://m.media-amazon.com/images/I/51dckF0QWEL._UF1000,1000_QL80_.jpg" },
    { id: 9, name: "Coffee", price: 150, image: "https://m.media-amazon.com/images/I/71OexQTz4-L.jpg" },
    { id: 10, name: "Oil", price: 200, image: "https://m.media-amazon.com/images/I/71wVU7pgwAL.jpg" },
    { id: 11, name: "Biscuits", price: 20, image:"https://m.media-amazon.com/images/I/61R96f7MhlL._SX679_.jpg" },
    { id: 12, name: "Namkeen", price: 20, image:"https://m.media-amazon.com/images/I/91s9lgRQN0L.jpg"}
  ];

  const addToCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const getQuantity = (productId: number) => {
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const goToPlaceOrder = () => {
    const detailedCart = cart.map((c) => {
      const product = products.find((p) => p.id === c.id)!;
      return { name: product.name, price: product.price, quantity: c.quantity };
    });
    localStorage.setItem("cart", JSON.stringify(detailedCart));
    router.push("/customer/place");
  };

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Product Catalogue</h1>
        <div
          className="relative cursor-pointer text-2xl"
          onClick={goToPlaceOrder}
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-3 flex flex-col items-center"
            >
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-contain rounded-md mb-2"
              />
              <h3 className="text-gray-800 font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-600 font-medium mb-2">₹{product.price}</p>

              {quantity === 0 ? (
                <button
                  onClick={() => addToCart(product.id)}
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
