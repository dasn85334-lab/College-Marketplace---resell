'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

export default function SellPage() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files;
      setImage(file as File);
      setPreview(URL.createObjectURL(file as Blob));
    }
  };

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
      
      await addDoc(collection(db, "products"), {
        title: formData.get('title'),
        price: Number(formData.get('price')),
        description: formData.get('description'),
        category: formData.get('category'),
        condition: formData.get('condition'),
        imageUrl: imageUrl,
        sellerEmail: auth.currentUser?.email || "anonymous",
        sellerId: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });

      alert("Item listed successfully!");
      router.push('/marketplace');
    } catch (err) {
      console.error(err);
      alert("Error posting your item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 text-white max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8">List an Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm text-white/60">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                {preview ? (
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                  <span className="text-xs text-white/30">No Image</span>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white" 
              />
            </div>
          </div>

          <input name="title" required placeholder="Product Title" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" />
          
          <div className="grid grid-cols-2 gap-4">
            <input name="price" type="number" required placeholder="Price (₹)" className="w-full bg-white/5 border border-white/10 rounded-xl p-4" />
            
            <select 
  name="category" 
  required 
  defaultValue="" 
  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
>
  <option value="" disabled>Select Category</option>
  <option value="electronics">Electronics</option>
  <option value="mobiles">Mobiles</option>
  <option value="study materials">Study Materials</option>
  <option value="books">Books</option>
  <option value="stationeries">Stationeries</option>
  <option value="others">Others</option>
</select>
          </div>
          
          <select name="condition" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white">
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
          
          <textarea name="description" required placeholder="Describe your item..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4" />
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200"
          >
            {loading ? "Posting..." : "Post Listing"}
          </button>
        </form>
      </div>
    </main>
  );
}