"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function ProductPage() {

  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data)
    })
  }, [id])

  if (!product) {
    return <p className="p-10">Loading...</p>
  }

  const addToCart = async () => {
    await api.post("/cart", {
      productId: product.id,
      quantity: 1
    })

    alert("Added to cart")
  }

  return (
    <div className="grid md:grid-cols-2 gap-12 py-16">

      <img
        src={product.images?.[0]?.url}
        className="w-full rounded-xl"
      />

      <div>

        <h1 className="text-3xl font-bold">
          {product.title}
        </h1>

        <p className="text-gray-600 mt-4">
          {product.description}
        </p>

        <p className="text-2xl text-[#C8102E] font-bold mt-6">
          £{product.price}
        </p>

        <Button
          onClick={addToCart}
          className="mt-6 bg-[#C8102E]"
        >
          Add to Cart
        </Button>

      </div>

    </div>
  )
}