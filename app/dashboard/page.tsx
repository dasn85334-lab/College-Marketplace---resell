'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();

  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(
          collection(db, 'products')
        );

        const mine = snap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (item: any) =>
              item.sellerEmail ===
              session?.user?.email
          );

        setMyProducts(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email) {
      load();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    const ok = confirm(
      'Are you sure you want to delete this listing?'
    );

    if (!ok) return;

    try {
      await deleteDoc(
        doc(db, 'products', id)
      );

      setMyProducts((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      alert('Listing deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete listing');
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-white/60 text-sm">
                Welcome Back
              </p>

              <h1 className="text-4xl md:text-5xl font-bold mt-2">
                {session?.user?.name}
              </h1>

              <p className="text-white/50 mt-3">
                Manage your listings and track your marketplace activity.
              </p>
            </div>

            <Link
              href="/sell"
              className="bg-white text-black px-6 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition text-center"
            >
              + Add New Listing
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-white/50">
              Active Listings
            </p>

            <h2 className="text-5xl font-bold mt-3">
              {myProducts.length}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-white/50">
              Messages
            </p>

            <h2 className="text-5xl font-bold mt-3">
              0
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <p className="text-white/50">
              Sold Items
            </p>

            <h2 className="text-5xl font-bold mt-3">
              0
            </h2>
          </div>

        </div>

        {/* Listings */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            My Listings
          </h2>

          <span className="text-white/50">
            {myProducts.length} items
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            Loading...
          </div>
        ) : myProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold mb-3">
              No Listings Yet
            </h3>

            <p className="text-white/50 mb-6">
              Start selling your books, notes and gadgets.
            </p>

            <Link
              href="/sell"
              className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold"
            >
              Create First Listing
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {myProducts.map((item: any) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500 transition"
              >
                <Link
                  href={`/marketplace/${item.id}`}
                >
                  <div className="relative h-60">
                    <Image
                      src={
                        item.imageUrl ||
                        '/placeholder.png'
                      }
                      alt={
                        item.title ||
                        'Product Image'
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="p-5">

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl">
                      {item.title}
                    </h3>

                    <span className="text-green-400 font-bold">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-white/50 text-sm mt-2 capitalize">
                    {item.category}
                  </p>

                  <div className="flex gap-3 mt-6">

  <Link
    href={`/marketplace/${item.id}`}
    className="flex-1 text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
  >
    View
  </Link>

  <Link
    href={`/edit/${item.id}`}
    className="flex-1 text-center py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition"
  >
    Edit
  </Link>

  <button
    onClick={() =>
      handleDelete(item.id)
    }
    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition"
  >
    Delete
  </button>

</div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </main>
  );
}