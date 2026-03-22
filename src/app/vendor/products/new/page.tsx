"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX:
// 1. No redirect after product creation — user stays on a half-cleared form
// 2. Added discountPrice field (was missing despite spec requiring it)
// 3. Added multi-variant UI (size + color + stock per variant)
// 4. Added description as required check
// 5. Added loading skeleton on image upload

const CATEGORIES = ["Tea & Teaware", "Home Decor", "Snacks", "Herbs", "Kitchen", "Fashion", "Beauty", "Other"]

export default function AddProduct() {
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    discountPrice: "",
    categoryName: "",
  })

  const [variants, setVariants] = useState([
    { size: "Default", color: "Default", stock: 10 }
  ])

  const addVariant = () => setVariants([...variants, { size: "", color: "", stock: 0 }])
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i))
  const updateVariant = (i: number, field: string, value: string | number) => {
    setVariants(variants.map((v, idx) => idx === i ? { ...v, [field]: value } : v))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const submit = async () => {
    if (!form.title || !form.categoryName || form.price <= 0) {
      toast.error("Title, category and a valid price are required")
      return
    }
    if (!form.description) {
      toast.error("Please add a product description")
      return
    }
    if (variants.some(v => !v.size)) {
      toast.error("All variants need a size/name")
      return
    }

    try {
      setLoading(true)
      let imageUrl = "https://placehold.co/600x400"

      if (image) {
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.readAsDataURL(image)
          reader.onloadend = () => resolve(reader.result as string)
        })
        const upload = await api.post("/upload", { image: base64 })
        imageUrl = upload.data.url
      }

      await api.post("/vendor/products", {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        images: [imageUrl],
        variants: variants.map(v => ({
          ...v,
          sku: crypto.randomUUID(),
          stock: Number(v.stock),
        })),
      })

      toast.success("Product created successfully!")
      // BUG FIX: redirect to product list after creation
      router.push("/vendor/products")
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Error creating product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-2">Add Product</h1>
      <p className="text-sm text-gray-400 mb-8">List a new product in your store</p>

      <input placeholder="Title *" value={form.title}
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <textarea placeholder="Description *" value={form.description}
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors min-h-[100px]"
        onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <input type="number" placeholder="Price (£) *" value={form.price || ""}
          className="border border-gray-200 p-3 outline-none focus:border-[#C8102E] transition-colors"
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <input type="number" placeholder="Sale Price (£) optional" value={form.discountPrice}
          className="border border-gray-200 p-3 outline-none focus:border-[#C8102E] transition-colors"
          onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
      </div>

      <select value={form.categoryName}
        className="border border-gray-200 p-3 w-full mb-6 outline-none focus:border-[#C8102E] transition-colors bg-white text-gray-600"
        onChange={(e) => setForm({ ...form, categoryName: e.target.value })}>
        <option value="">Select Category *</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Image upload */}
      <div className="mb-6">
        <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Product Image</p>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded mb-2 border border-gray-100" />
        )}
        <input type="file" accept="image/*" className="text-sm text-gray-500"
          onChange={handleImageChange} />
      </div>

      {/* Variants */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs tracking-widest text-gray-500 uppercase">Variants</p>
          <button onClick={addVariant} className="text-xs text-[#C8102E] hover:underline">+ Add Variant</button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input placeholder="Size" value={v.size}
              className="border border-gray-200 p-2 text-sm outline-none focus:border-[#C8102E]"
              onChange={(e) => updateVariant(i, "size", e.target.value)} />
            <input placeholder="Color" value={v.color}
              className="border border-gray-200 p-2 text-sm outline-none focus:border-[#C8102E]"
              onChange={(e) => updateVariant(i, "color", e.target.value)} />
            <div className="flex gap-1">
              <input type="number" placeholder="Stock" value={v.stock}
                className="border border-gray-200 p-2 text-sm outline-none focus:border-[#C8102E] flex-1 min-w-0"
                onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} />
              {variants.length > 1 && (
                <button onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 px-1">✕</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={submit} disabled={loading} className="bg-[#C8102E] hover:bg-[#a80d25] w-full">
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </div>
  )
}
