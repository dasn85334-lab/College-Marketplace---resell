'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SellPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  // Multiple image state
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // PDF state
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState('');

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    setImages(files);

    setPreviews(
      files.map((file) =>
        URL.createObjectURL(file)
      )
    );
  };

  const handlePdfChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPdf(file);
    setPdfName(file.name);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload all images
      let imageUrls: string[] = [];

      for (const image of images) {
        const uploadForm = new FormData();

        uploadForm.append(
          'file',
          image
        );

        const uploadResponse =
          await fetch(
            '/api/upload',
            {
              method: 'POST',
              body: uploadForm,
            }
          );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error ||
              'Image upload failed'
          );
        }

        imageUrls.push(
  uploadData.url
);
      }

      // Upload PDF
      let pdfUrl = '';

      if (pdf) {
        const pdfForm =
          new FormData();

        pdfForm.append(
          'file',
          pdf
        );

        const pdfResponse =
          await fetch(
            '/api/upload',
            {
              method: 'POST',
              body: pdfForm,
            }
          );

        const pdfData =
          await pdfResponse.json();
          console.log('PDF DATA:', pdfData);
          alert(JSON.stringify(pdfData, null, 2));

        if (!pdfResponse.ok) {
          throw new Error(
            pdfData.error ||
              'PDF upload failed'
          );
        }

        pdfUrl = pdfData.url;
      }

      const form =
        e.target as HTMLFormElement;

      const formData =
        new FormData(form);

      const productData = {
  title: String(
    formData.get('title') || ''
  ),

  price: Number(
    formData.get('price') || 0
  ),

  description: String(
    formData.get('description') || ''
  ),

  category: String(
    formData.get('category') || 'others'
  ),

  condition: String(
    formData.get('condition') || 'New'
  ),

  images: imageUrls.filter(Boolean),

  imageUrl:
    imageUrls[0] || '',

  pdfUrl:
    pdfUrl || '',

  sellerEmail:
    session?.user?.email ||
    'anonymous',

  sellerName:
    session?.user?.name ||
    'anonymous',

  createdAt:
    serverTimestamp(),
};

console.log(
  'PRODUCT DATA:',
  productData
);

console.log('PRODUCT DATA:', productData);

await addDoc(
  collection(db, 'products'),
  productData
);

      alert(
        'Item listed successfully!'
      );

      router.push(
        '/marketplace'
      );
    } catch (error: any) {
      console.error(
        'FULL ERROR:',
        error
      );

      alert(
        error?.message ||
          JSON.stringify(
            error
          ) ||
          'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 text-white max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold mb-8">
          List an Item
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >

          {/* Images */}
          <div className="space-y-4">

            <label className="block text-sm text-white/60">
              Product Images
            </label>

            <div className="flex flex-wrap gap-3">
              {previews.length >
              0 ? (
                previews.map(
                  (
                    preview,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative"
                    >
                      <Image
                        src={
                          preview
                        }
                        alt={`Preview ${
                          index +
                          1
                        }`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                )
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs text-white/30">
                    No Images
                  </span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageChange
              }
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white"
            />
          </div>

          {/* PDF Upload */}
          <div className="space-y-3">

            <label className="block text-sm text-white/60">
              PDF File
              (Notes / Book)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={
                handlePdfChange
              }
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white"
            />

            {pdfName && (
              <p className="text-green-400 text-sm">
                {pdfName}
              </p>
            )}

          </div>

          <input
            name="title"
            required
            placeholder="Product Title"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              name="price"
              type="number"
              required
              placeholder="Price (₹)"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4"
            />

            <select
              name="category"
              required
              defaultValue=""
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
            >
              <option
                value=""
                disabled
              >
                Select Category
              </option>

              <option value="electronics">
                Electronics
              </option>

              <option value="mobiles">
                Mobiles
              </option>

              <option value="study materials">
                Study Materials
              </option>

              <option value="books">
                Books
              </option>

              <option value="stationeries">
                Stationeries
              </option>

              <option value="others">
                Others
              </option>
            </select>

          </div>

          <select
            name="condition"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white"
          >
            <option value="New">
              New
            </option>

            <option value="Like New">
              Like New
            </option>

            <option value="Good">
              Good
            </option>

            <option value="Fair">
              Fair
            </option>
          </select>

          <textarea
            name="description"
            required
            placeholder="Describe your item..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading
              ? 'Posting...'
              : 'Post Listing'}
          </button>

        </form>
      </div>
    </main>
  );
}