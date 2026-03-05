"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function AddProduct() {

  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    categoryName: ""
  })

  const submit = async () => {

    try {

      setLoading(true)

      let imageUrl = ""

      // upload image if exists
      if (image) {

        const reader = new FileReader()

        const base64 = await new Promise<string>((resolve) => {

          reader.readAsDataURL(image)

          reader.onloadend = () => {
            resolve(reader.result as string)
          }

        })

        const upload = await api.post("/upload", {
          image: base64
        })

        imageUrl = upload.data.url
      }

      // create product
      await api.post("/vendor/products", {

        ...form,

        images: [
          imageUrl || "https://placehold.co/600x400"
        ],

        variants: [
          {
            size: "Default",
            color: "Default",
            sku: Math.random().toString(),
            stock: 10
          }
        ]

      })

      alert("Product created successfully")

      setForm({
        title: "",
        description: "",
        price: 0,
        categoryName: ""
      })

      setImage(null)

    } catch (error) {

      console.error(error)
      alert("Error creating product")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="max-w-xl mx-auto py-16">

      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>

      <input
        placeholder="Title"
        value={form.title}
        className="border p-3 w-full mb-4"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        value={form.description}
        className="border p-3 w-full mb-4"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        className="border p-3 w-full mb-4"
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <input
        placeholder="Category"
        value={form.categoryName}
        className="border p-3 w-full mb-4"
        onChange={(e) =>
          setForm({ ...form, categoryName: e.target.value })
        }
      />

      <input
        type="file"
        className="mb-6"
        onChange={(e) =>
          setImage(e.target.files?.[0] || null)
        }
      />

      <Button
        onClick={submit}
        disabled={loading}
        className="bg-[#C8102E] hover:bg-red-700"
      >
        {loading ? "Creating..." : "Create Product"}
      </Button>

    </div>
  )
}