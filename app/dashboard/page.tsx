"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyProducts = async () => {
      // Safety check: ensure user is logged in
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "products"),
        where("sellerId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMyProducts();
  }, []);

  return (
    <main className="min-h-screen pt-24 px-6 text-white bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Your Products</h1>
        
        {products.length === 0 ? (
            <p className="text-white/50">You haven't listed any items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              // This Link wrapper makes the whole card clickable
              <Link href={`/products/${p.id}`} key={p.id} className="block">
                <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl hover:border-indigo-500 transition-all cursor-pointer group">
                  {p.imageUrl && (
                    <img 
                      src={p.imageUrl} 
                      alt={p.tile} 
                      className="w-full h-40 object-cover rounded-lg mb-4" 
                    />
                  )}
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {p.tile}
                  </h2>
                  <p className="text-indigo-400 font-bold mt-1">₹{p.price}</p>
                  <p className="text-white/60 text-sm mt-2 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}