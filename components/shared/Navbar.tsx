'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        <Link
          href="/"
          className="font-bold text-lg md:text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          ICFAI Market
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/sell">Sell</Link>

          {session && (
            <Link href="/dashboard">
              Dashboard
            </Link>
          )}

          {session ? (
            <button
              onClick={() =>
                signOut({
                  callbackUrl: '/',
                })
              }
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">

          <div className="flex flex-col p-4 gap-4">

            <Link
              href="/marketplace"
              onClick={() => setOpen(false)}
            >
              Marketplace
            </Link>

            <Link
              href="/sell"
              onClick={() => setOpen(false)}
            >
              Sell
            </Link>

            {session && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {session ? (
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: '/',
                  })
                }
                className="bg-red-600 rounded-xl py-3"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 rounded-xl py-3 text-center"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}