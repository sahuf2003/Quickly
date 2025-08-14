'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white text-gray-800">

      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            Quickly
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link href="/customer/auth" className="text-purple-600 font-medium hover:underline">
              Customer Login
            </Link>
            <Link href="/partners/auth" className="text-purple-600 font-medium hover:underline">
              Partner Login
            </Link>
            <Link
              href="/admin/login"
              className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
            >
              Admin Login
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-purple-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden bg-white px-4 pb-4 space-y-2">
            <Link
              href="/customer/auth"
              className="block text-purple-600 font-medium hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Customer Login
            </Link>
            <Link
              href="/partners/auth"
              className="block text-purple-600 font-medium hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Partner Login
            </Link>
            <Link
              href="/admin/login"
              className="block bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Link>
          </nav>
        )}
      </header>
<section className="flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-8 py-12 md:py-16 max-w-7xl mx-auto">
  <div className="md:w-1/2 space-y-6 text-center md:text-left md:pr-8">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
      Fastest Delivery in <span className="text-purple-600">Minutes</span>
    </h1>
    <p className="text-gray-600 text-base sm:text-lg">
      Get groceries, snacks, and essentials delivered at your doorstep faster than you can imagine.
    </p>
    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4 mt-4">
      <Link
        href="/customer/auth"
        className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
      >
        Start Shopping
      </Link>
    </div>
  </div>

<div className="md:w-1/2 flex justify-center mb-8 md:mb-0 md:pl-8">
  <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center bg-purple-100 rounded-full">
    {/* Purple Lightning Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 h-24 sm:w-32 sm:h-32 text-purple-600"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M11.3 1L1 12h6v7l10-11h-6l.3-7z" />
    </svg>
  </div>
</div>


</section>



      {/* Features */}
      <section id="features" className="py-12 sm:py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Why Choose Quickly?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: 'Ultra Fast Delivery', desc: 'Your order delivered in 10 minutes or less.', icon: '🚀' },
              { title: 'Fresh Products', desc: 'Only the freshest items picked for you.', icon: '🥬' },
              { title: '24/7 Support', desc: 'We’re here for you anytime.', icon: '💬' },
            ].map((f, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-8">
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
    Top Categories
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
    {[
      { name: 'Groceries', icon: '🛒' },
      { name: 'Fruits', icon: '🍎' },
      { name: 'Snacks', icon: '🍿' },
      { name: 'Drinks', icon: '🥤' },
      { name: 'Dairy', icon: '🧈' },
      { name: 'Bakery', icon: '🥐' },
      { name: 'Frozen', icon: '❄️' },
      { name: 'Household', icon: '🏠' },
    ].map((cat, idx) => (
      <div
        key={idx}
        className="bg-white shadow rounded-xl p-4 text-center hover:shadow-lg transition flex flex-col items-center justify-center"
      >
        <div className="text-4xl mb-2">{cat.icon}</div>
        <p className="mt-2 font-medium">{cat.name}</p>
      </div>
    ))}
  </div>
</section>


      {/* App Download */}
      <section className="py-12 sm:py-16 bg-purple-600 text-white text-center px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Download the Quickly App</h2>
        <p className="mb-6 sm:mb-8">Shop faster and easier with our mobile app.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="w-40 h-12 bg-white rounded-lg flex items-center justify-center text-purple-600 font-semibold">Play Store</div>
          <div className="w-40 h-12 bg-white rounded-lg flex items-center justify-center text-purple-600 font-semibold">App Store</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-purple-800 text-center text-white mt-auto">
        <p>© {new Date().getFullYear()} Quickly. All rights reserved.</p>
      </footer>
    </div>
  );
}
