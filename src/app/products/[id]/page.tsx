"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data)
      if (res.data.variants?.length > 0) {
        setSelectedVariant(res.data.variants[0])
      }
    }).catch(() => toast.error("Failed to load product"))
  }, [id])

  if (!product) return <p className="p-10 text-gray-500">Loading...</p>

  const addToCart = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to add items to cart")
      router.push("/login")
      return
    }

    try {
      setAdding(true)
      await api.post("/cart", {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        quantity: 1,
      })
      toast.success("Added to cart!")
    } catch (err) {
      toast.error("Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 py-16 px-4">
      <img
        src={product.images?.[0]?.url || "/placeholder.png"}
        alt={product.title}
        className="w-full rounded-xl object-cover aspect-square"
      />

      <div>
        {product.category && (
          <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-2">{product.category.name}</p>
        )}

        <h1 className="font-serif text-3xl text-[#1a1208] mb-4">{product.title}</h1>

        <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif text-3xl text-[#1a1208]">£{product.price}</span>
          {product.discountPrice && (
            <span className="text-lg text-gray-400 line-through">£{product.discountPrice}</span>
          )}
        </div>

        {/* Variant selector */}
        {product.variants?.length > 1 && (
          <div className="mb-6">
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Variant</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 text-sm border transition ${
                    selectedVariant?.id === v.id
                      ? "border-[#C8102E] bg-[#C8102E] text-white"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {v.size} {v.color !== "Default" ? `/ ${v.color}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={addToCart}
          disabled={adding}
          className="bg-[#C8102E] hover:bg-[#a80d25] text-white px-10 py-3 text-sm tracking-widest"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </Button>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h3 className="font-semibold mb-4">Reviews ({product.reviews.length})</h3>
            {product.reviews.map((r: any) => (
              <div key={r.id} className="mb-4 text-sm text-gray-600 border-b pb-4">
                <p className="font-medium text-gray-800">Rating: {r.rating}/5</p>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
