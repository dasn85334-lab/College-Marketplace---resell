'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const categories = [
  { name: 'Electronics', image: '/electronics.png' },
  { name: 'Mobiles', image: '/mobiles.png' },
  { name: 'Study Materials', image: '/notes.png' },
  { name: 'Books', image: '/books.png' },
  { name: 'Stationeries', image: '/stationaries.png' },
  { name: 'Others', image: '/others.png' },
];

function MarketplaceInner() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(
          collection(db, 'products')
        );

        setProducts(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const itemCat = p.category?.toLowerCase() || 'others';
    return activeCategory ? itemCat === activeCategory : true;
  });

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-24 min-h-screen">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-bold mb-12">
        Marketplace
      </h1>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-16">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/marketplace?category=${cat.name.toLowerCase()}`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-2xl border ${
                activeCategory === cat.name.toLowerCase()
                  ? 'bg-white/20 border-white/50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <p className="text-center text-sm font-medium">
                {cat.name}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filteredProducts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card rounded-3xl p-4 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <Link href={`/marketplace/${item.id}`}>
                <div className="h-48 relative rounded-2xl overflow-hidden mb-4">
                  <Image
  src={
    item.imageUrl
      ? item.imageUrl.replace(
          'http://',
          'https://'
        )
      : '/placeholder.png'
  }
                    alt={item.title || 'Product'}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="font-bold text-lg">
                  {item.title}
                </h3>

                <p className="text-blue-400 font-semibold">
                  ₹{item.price}
                </p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketplaceInner />
    </Suspense>
  );
}