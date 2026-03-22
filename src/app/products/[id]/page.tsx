"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX:
// 1. discountPrice display was inverted — was showing discountPrice as original, price as discounted
// 2. Image gallery was single image — added multi-image gallery
// 3. Star rating display added (was missing from reviews)
// 4. Out-of-stock variants now disabled
// 5. Cart button correctly uses auth check before redirect

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data)
        if (res.data.variants?.length > 0) setSelectedVariant(res.data.variants[0])
      })
      .catch(() => toast.error("Failed to load product"))
  }, [id])

  if (!product) return (
    <div className="max-w-5xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12">
      <div className="aspect-square bg-gray-100 animate-pulse rounded-xl" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
        <div className="h-8 bg-gray-100 animate-pulse rounded w-2/3" />
        <div className="h-20 bg-gray-100 animate-pulse rounded" />
      </div>
    </div>
  )

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
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }

  // BUG FIX: price display was backwards — discountPrice is the SALE price, price is original
  const displayPrice = product.discountPrice ?? product.price
  const originalPrice = product.discountPrice ? product.price : null

  const images = product.images?.length > 0 ? product.images : [{ url: "/placeholder.png" }]

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <p className="text-xs text-gray-400 mb-6">
        <Link href="/products" className="hover:text-[#C8102E]">Products</Link>
        {" / "}
        {product.category?.name && <><Link href={`/products?category=${product.category.name}`} className="hover:text-[#C8102E]">{product.category.name}</Link>{" / "}</>}
        {product.title}
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div>
          <div className="aspect-square overflow-hidden bg-[#faf6f0] rounded-xl mb-3">
            <img
              src={images[activeImage]?.url || "/placeholder.png"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 border-2 rounded overflow-hidden transition ${activeImage === i ? "border-[#C8102E]" : "border-gray-100"}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.category && (
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-2">{product.category.name}</p>
          )}

          <h1 className="font-serif text-3xl text-[#1a1208] mb-4">{product.title}</h1>

          <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>

          {/* BUG FIX: correct price display */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-3xl text-[#C8102E]">£{displayPrice}</span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through">£{originalPrice}</span>
            )}
            {product.discountPrice && (
              <span className="text-xs bg-[#C8102E] text-white px-2 py-0.5 tracking-wider">SALE</span>
            )}
          </div>

          {/* Variant selector */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-4 py-2 text-sm border transition ${
                      v.stock === 0 ? "border-gray-100 text-gray-300 cursor-not-allowed line-through" :
                      selectedVariant?.id === v.id ? "border-[#C8102E] bg-[#C8102E] text-white" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {v.size}{v.color && v.color !== "Default" ? ` / ${v.color}` : ""}
                    {v.stock === 0 ? " (Out of stock)" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={addToCart}
            disabled={adding || (selectedVariant && selectedVariant.stock === 0)}
            className="bg-[#C8102E] hover:bg-[#a80d25] text-white px-10 py-3 text-sm tracking-widest w-full md:w-auto"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </Button>

          <div className="mt-6 text-xs text-gray-400 space-y-1">
            <p>✓ UK delivery only · estimated 3–5 business days</p>
            <p>✓ Stocked in our UK warehouse</p>
            <p>✓ 20% VAT included</p>
          </div>

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div className="mt-10 border-t pt-8">
              <h3 className="font-medium text-[#1a1208] mb-4">Reviews ({product.reviews.length})</h3>
              {product.reviews.map((r: any) => (
                <div key={r.id} className="mb-4 text-sm text-gray-600 border-b border-[#f0e6d6] pb-4">
                  {/* BUG FIX: render actual star symbols */}
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.rating ? "text-[#FFD700]" : "text-gray-200"}>★</span>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{r.rating}/5</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
