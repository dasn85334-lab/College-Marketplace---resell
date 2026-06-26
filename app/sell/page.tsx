'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SellPage() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const formData = new FormData(e.currentTarget);
      
      // Save data with sellerId so your Dashboard can find it
      await addDoc(collection(db, "products"), {
        tile: formData.get('tile'),
        price: Number(formData.get('price')),
        description: formData.get('description'),
        category: formData.get('category'),
        condition: formData.get('condition'),
        imageUrl: imageUrl,
        sellerEmail: auth.currentUser?.email || "no-email@example.com",
        sellerId: auth.currentUser?.uid, // <--- THIS IS THE MISSING KEY
        createdAt: serverTimestamp(),
      });

      alert("Item listed successfully!");
      router.push('/marketplace');
    } catch (err) {
      console.error(err);
      alert("Error posting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 text-white">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">List an Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="tile" required placeholder="Product Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" />
          
          <div className="space-y-2">
            <label className="text-sm text-white/60">Upload Image</label>
            <input 
              type="file" 
              // FIX: Access files to get the single file
              onChange={(e: any) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files);
                } else {
                  setImage(null);
                }
              }} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4" 
            />
          </div>

          <input name="price" type="number" required placeholder="Price" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" />
          <input name="category" required placeholder="Category" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" />
          
          <select name="condition" className="w-full bg-white/5 border border-white/10 rounded-xl p-4">
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
          </select>
          
          <textarea name="description" required placeholder="Description" className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4" />
          
          <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200">
            {loading ? "Posting..." : "Post Listing"}
          </button>
        </form>
      </div>
    </main>
  );
}