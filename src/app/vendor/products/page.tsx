"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// BUG FIX: page was a static placeholder with no actual product list.
// Now fetches real vendor products from the new GET /api/vendor/products endpoint.

export default function VendorProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await api.get("/vendor/products")
      setProducts(res.data)
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      await api.delete(`/vendor/products/${id}`)
      toast.success("Product deleted")
      fetchProducts()
    } catch {
      toast.error("Failed to delete product")
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-3xl text-[#1a1208]">Your Products</h1>
        <Link href="/vendor/products/new">
          <Button className="bg-[#C8102E] hover:bg-[#a80d25]">+ Add Product</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No products yet</p>
          <p className="text-sm mb-6">Start by adding your first product.</p>
          <Link href="/vendor/products/new">
            <Button className="bg-[#C8102E] hover:bg-[#a80d25]">Add Product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-[#f0e6d6] rounded-xl overflow-hidden">
              <img
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-[#c8a96e] uppercase tracking-wider mb-1">{product.category?.name}</p>
                <h3 className="font-medium text-[#1a1208] mb-1 line-clamp-1">{product.title}</h3>
                <p className="font-serif text-base text-[#1a1208] mb-1">£{product.price}</p>
                <p className="text-xs text-gray-400">Stock: {product.totalStock}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
