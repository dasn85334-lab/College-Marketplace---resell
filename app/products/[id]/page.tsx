"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [p, setP] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id as string));
      if (snap.exists()) setP({ id: snap.id, ...snap.data() });
    };
    fetchProduct();
  }, [id]);

  if (!p) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="p-10 max-w-2xl mx-auto text-white">
      {p.imageUrl && <img src={p.imageUrl} className="w-full h-80 object-cover rounded-xl" />}
      <h1 className="text-4xl font-bold mt-6">{p.tile}</h1>
      <p className="text-2xl text-indigo-400 mt-2">₹{p.price}</p>
      <p className="mt-4">{p.description}</p>
      <p className="mt-2 text-white/50">Condition: {p.condition}</p>
      
      <a href={`mailto:${p.sellerEmail}`} className="block mt-10 bg-green-600 text-center py-4 rounded-xl font-bold">
        Contact Seller via Email
      </a>
    </main>
  );
}