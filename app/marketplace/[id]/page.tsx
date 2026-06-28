'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] =
    useState<string>('');

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const docRef = doc(
          db,
          'products',
          id as string
        );

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setProduct(data);

          if (
            data.images &&
            data.images.length > 0
          ) {
            setSelectedImage(
              data.images[0]
            );
          } else {
            setSelectedImage(
              data.imageUrl || ''
            );
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="pt-24 px-6 text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          Loading...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 px-6 text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          Product not found.
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 px-6 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div>

            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={
  selectedImage
    ? selectedImage.replace(
        'http://',
        'https://'
      )
    : '/placeholder.png'
}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            {(product.images?.length > 1) && (
              <div className="flex gap-3 mt-4 overflow-x-auto">

                {product.images.map(
                  (
                    image: string,
                    index: number
                  ) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedImage(
                          image
                        )
                      }
                      className={`relative min-w-[90px] h-[90px] rounded-xl overflow-hidden border ${
                        selectedImage === image
                          ? 'border-blue-500'
                          : 'border-white/10'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Image ${
                          index + 1
                        }`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div>

            <h1 className="text-5xl font-bold mb-4">
              {product.title}
            </h1>

            <p className="text-4xl font-bold text-green-400 mb-6">
              ₹{product.price}
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">

              <h2 className="text-xl font-semibold mb-4">
                Description
              </h2>

              <p className="text-white/80 leading-relaxed">
                {product.description}
              </p>

            </div>
            {product.pdfUrl && (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">
      Attached PDF
    </h2>

    <div className="flex gap-3">
      <a
        href={product.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
      >
        View PDF
      </a>

      <a
        href={product.pdfUrl}
        download
        className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl"
      >
        Download PDF
      </a>
    </div>
  </div>
)}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">

              <div className="flex justify-between">
                <span className="text-white/50">
                  Category
                </span>

                <span className="capitalize">
                  {product.category}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">
                  Condition
                </span>

                <span>
                  {product.condition}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">
                  Seller
                </span>

                <span>
                  {product.sellerName ||
                    'Anonymous'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">
                  Email
                </span>

                <span>
                  {product.sellerEmail ||
                    'Not available'}
                </span>
              </div>
              <a
  href={`mailto:${product.sellerEmail}?subject=Interested in ${product.title}&body=Hi ${product.sellerName}, I am interested in your listing "${product.title}".`}
  className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-center py-4 rounded-xl font-semibold transition"
>
  Contact Seller
</a>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}