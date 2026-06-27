'use client';
import { useState } from 'react';
import Link from 'next/link';
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => signOut(auth);

  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Logo</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/marketplace">Marketplace</Link>
          <button onClick={handleLogout} className="text-red-400">Logout</button>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 p-6 flex flex-col gap-4 border-b border-white/10">
          <Link href="/marketplace" onClick={() => setIsOpen(false)}>Marketplace</Link>
          <button 
            onClick={() => { handleLogout(); setIsOpen(false); }} 
            className="text-red-400 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}