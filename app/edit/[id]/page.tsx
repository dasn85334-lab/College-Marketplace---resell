'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [title, setTitle] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [condition, setCondition] =
    useState('');

  const [images, setImages] =
    useState<string[]>([]);

  const [newImages, setNewImages] =
    useState<File[]>([]);

  const [previews, setPreviews] =
    useState<string[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const docRef = doc(
          db,
          'products',
          id as string
        );

        const snap =
          await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          setTitle(data.title || '');

          setPrice(
            String(data.price || '')
          );

          setDescription(
            data.description || ''
          );

          setCategory(
            data.category || ''
          );

          setCondition(
            data.condition || ''
          );

          setImages(
            data.images || []
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    setNewImages(files);

    setPreviews(
      files.map((file) =>
        URL.createObjectURL(file)
      )
    );
  };

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);

    try {
      let updatedImages =
        [...images];

      if (
        newImages.length > 0
      ) {
        updatedImages = [];

        for (const image of newImages) {
          const uploadForm =
            new FormData();

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

          if (
            !uploadResponse.ok
          ) {
            throw new Error(
              uploadData.error ||
                'Image upload failed'
            );
          }

          updatedImages.push(
            uploadData.url
          );
        }
      }

      await updateDoc(
        doc(
          db,
          'products',
          id as string
        ),
        {
          title,
          price:
            Number(price),
          description,
          category,
          condition,

          images:
            updatedImages,

          imageUrl:
            updatedImages[0] ||
            '',
        }
      );

      alert(
        'Listing updated successfully'
      );

      router.push(
        '/dashboard'
      );
    } catch (error) {
      console.error(error);

      alert(
        'Failed to update listing'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-24 text-white">
        <div className="max-w-2xl mx-auto px-6">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 text-white max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">

        <h1 className="text-3xl font-bold mb-8">
          Edit Listing
        </h1>

        <form
          onSubmit={handleSave}
          className="space-y-6"
        >

          <div>
            <label className="block text-sm text-white/60 mb-3">
              Product Images
            </label>

            <div className="flex flex-wrap gap-3 mb-4">

              {(previews.length > 0
                ? previews
                : images
              ).map(
                (
                  image,
                  index
                ) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10"
                  >
                    <Image
                      src={image}
                      alt={`Image ${index}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )
              )}

            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageChange
              }
              className="text-sm"
            />

            <p className="text-white/40 text-xs mt-2">
              Selecting new images will replace all existing images.
            </p>
          </div>

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Title"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4"
          />

          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            placeholder="Price"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4"
          >
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

          <select
            value={condition}
            onChange={(e) =>
              setCondition(
                e.target.value
              )
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4"
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
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl"
          >
            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </button>

        </form>

      </div>
    </main>
  );
}