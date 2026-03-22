"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import ProductCard from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

const CATEGORIES = ["Tea & Teaware", "Home Decor", "Snacks", "Herbs", "Kitchen", "Fashion", "Beauty"]

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const LIMIT = 24

  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (category) params.set("category", category)
      params.set("page", String(pageNum))
      params.set("limit", String(LIMIT))
      const res = await api.get(`/products?${params.toString()}`)
      setProducts(res.data.products || [])
      setTotal(res.data.total || 0)
      setPage(pageNum)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 whenever search/category changes
  useEffect(() => { fetchProducts(1) }, [search, category])

  const setCategory = (cat: string) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (cat) params.set("category", cat)
    router.push(`/products?${params.toString()}`)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1208] mb-2">
          {search ? `Results for "${search}"` : category || "All Products"}
        </h1>
        <p className="text-sm text-gray-400">
          {loading ? "Loading..." : `${total} product${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-1.5 text-xs tracking-wider border transition ${!category ? "bg-[#C8102E] text-white border-[#C8102E]" : "border-gray-200 text-gray-600 hover:border-[#C8102E]"
            }`}
        >
          ALL
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 text-xs tracking-wider border transition ${category === cat ? "bg-[#C8102E] text-white border-[#C8102E]" : "border-gray-200 text-gray-600 hover:border-[#C8102E]"
              }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg mb-2">No products found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination — only shown when there are multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => fetchProducts(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-gray-200 text-gray-600 hover:border-[#C8102E] hover:text-[#C8102E] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProducts(p)}
                  className={`w-9 h-9 text-sm border transition ${p === page
                      ? "bg-[#C8102E] text-white border-[#C8102E]"
                      : "border-gray-200 text-gray-600 hover:border-[#C8102E]"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => fetchProducts(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-gray-200 text-gray-600 hover:border-[#C8102E] hover:text-[#C8102E] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
