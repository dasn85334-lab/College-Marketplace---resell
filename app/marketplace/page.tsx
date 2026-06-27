'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from "@/lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";

const categories = [
  { name: "Electronics", image: "/electronics.png" },
  { name: "Mobiles", image: "/mobiles.png" },
  { name: "Study Materials", image: "/notes.png" },
  { name: "Books", image: "/books.png" },
  { name: "Stationeries", image: "/stationaries.png" },
  { name: "Others", image: "/others.png" },
];

const validCategories = ["electronics", "mobiles", "study materials", "books", "stationeries"];

function MarketplaceContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase();

  // Fetch data from Firestore
  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const itemCat = p.category?.toLowerCase() || 'others';
    
    if (activeCategory === 'others') {
      return !validCategories.includes(itemCat);
    }
    if (activeCategory) {
      return itemCat === activeCategory;
    }
    return true;
  });

  if (loading) {
    return <div className="text-center py-20 text-white/50">Loading marketplace listings...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/marketplace?category=${cat.name.toLowerCase()}`}
            className={`flex flex-col items-center p-4 rounded-2xl transition-all border ${activeCategory === cat.name.toLowerCase() ? 'bg-white/20 border-white/50' : 'bg-white/5 border-white/10'}`}
          >
            <div className="w-12 h-12 mb-3 relative">
              <Image src={cat.image} alt={cat.name} fill className="object-contain" unoptimized />
            </div>
            <span className="text-xs font-medium text-center">{cat.name}</span>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-8">
          {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : "All Listings"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => {
              const displayImage = item.imageUrl && item.imageUrl.length > 0 ? item.imageUrl : "/placeholder.png";
              
              return (
                /* Dynamic Link to the Detail Page using item.id */
                <Link href={`/marketplace/${item.id}`} key={item.id} className="block group">
                  <div className="glass-card p-4 rounded-3xl border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                    <div className="h-40 relative mb-4 overflow-hidden rounded-xl">
                      <Image 
                        src={displayImage} 
                        alt={item.title || "Product"} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        unoptimized 
                      />
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-blue-400 font-semibold">₹{item.price}</p>
                    <p className="text-[10px] text-white/40 uppercase mt-2">{item.category}</p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-white/50">No items found in this category.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default function MarketplacePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <h2 className="text-2xl font-bold mb-8">Browse Categories</h2>
      <Suspense fallback={<p>Loading...</p>}>
        <MarketplaceContent />
      </Suspense>
    </div>
  );
}