'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  'Electronics',
  'Mobiles',
  'Books',
  'Study Materials',
  'Stationeries',
  'Others',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="px-6 pt-28 pb-16 max-w-7xl mx-auto">

        <div className="text-center">

          <span className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 mb-6">
            ICFAI Student Marketplace
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
          >
            Buy. Sell. Trade.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Inside Your Campus.
            </span>
          </motion.h1>

          <p className="text-white/60 text-base md:text-xl max-w-2xl mx-auto mt-6">
            The safest way for ICFAI students to buy and sell books,
            electronics, notes, gadgets and daily essentials.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

            <Link
              href="/marketplace"
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
            >
              Explore Marketplace
            </Link>

            <Link
              href="/sell"
              className="border border-white/10 bg-white/5 px-8 py-4 rounded-2xl hover:bg-white/10 transition"
            >
              Sell an Item
            </Link>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <StatCard
            number="500+"
            label="Students"
          />

          <StatCard
            number="100+"
            label="Listings"
          />

          <StatCard
            number="24/7"
            label="Access"
          />

          <StatCard
            number="100%"
            label="Campus Only"
          />

        </div>

      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold mb-8">
          Browse Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {categories.map((category) => (
            <Link
              key={category}
              href={`/marketplace?category=${category.toLowerCase()}`}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-500 transition"
            >
              <h3 className="font-semibold text-lg">
                {category}
              </h3>
            </Link>
          ))}

        </div>

      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">

        <h2 className="text-3xl font-bold mb-8">
          Why Students Love It
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <FeatureCard
            title="Verified Users"
            desc="Only ICFAI students can access the marketplace."
          />

          <FeatureCard
            title="Safe Trading"
            desc="Buy and sell directly with trusted campus members."
          />

          <FeatureCard
            title="Quick Deals"
            desc="Find books, notes and gadgets instantly."
          />

        </div>

      </section>

    </main>
  );
}

function StatCard({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
      <h3 className="text-3xl font-bold">
        {number}
      </h3>

      <p className="text-white/50 mt-2">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-blue-500 transition">
      <h3 className="text-xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-white/60">
        {desc}
      </p>
    </div>
  );
}