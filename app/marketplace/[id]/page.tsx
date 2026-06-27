'use client';

import { useEffect, useState, use } from 'react'; // Added 'use' import
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';

// Fix: params is now a Promise
export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);

  // Unwrap the params promise
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    }
    unwrapParams();
  }, [params]);

  // Fetch the data
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const docRef = doc(db, "products", productId!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) return <div className="text-center py-20 text-white/50">Loading details...</div>;
  if (!product) return <div className="text-center py-20 text-white/50">Item not found.</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-white">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative h-96 w-full rounded-3xl overflow-hidden bg-white/5">
          <Image src={product.imageUrl || "/placeholder.png"} alt={product.title} fill className="object-cover" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-3xl text-blue-400 font-bold">₹{product.price}</p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="font-semibold mb-2 text-white/60">Condition: {product.condition}</h3>
            <p className="text-white">{product.description}</p>
          </div>
          
          <a 
            href={`mailto:${product.sellerEmail}?subject=Inquiry about ${product.title}`}
            className="block w-full py-4 bg-white text-black text-center font-bold rounded-xl hover:bg-neutral-200 transition"
          >
            Contact Seller
          </a>
        </div>
      </div>
    </main>
  );
}