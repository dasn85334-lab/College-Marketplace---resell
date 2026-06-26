"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <nav className="flex items-center justify-between p-6 border-b border-white/10">
      <Link href="/" className="text-xl font-bold tracking-tighter">
        ICFAI Marketplace
      </Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/marketplace" className="hover:text-blue-400 transition-colors">Explore</Link>
        <Link href="/sell" className="hover:text-blue-400 transition-colors">Sell</Link>
        <Link href="/team" className="hover:text-blue-400 transition-colors">Team</Link>
        
        {/* User Account / Profile Logic */}
        {user ? (
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="bg-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-all">
              Dashboard
            </Link>
            <button 
              onClick={() => signOut(auth)} 
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin} 
            className="bg-blue-600 px-4 py-2 rounded-full text-sm hover:bg-blue-500 transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}