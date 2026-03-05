"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function CartPage() {

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart")
      setItems(res.data.items || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const removeItem = async (id: string) => {
    await api.delete(`/cart/${id}`)
    fetchCart()
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  if (loading) {
    return <p className="p-10">Loading cart...</p>
  }

  return (
    <div className="max-w-5xl mx-auto py-16">

      <h1 className="text-3xl font-bold mb-10">
        Your Cart
      </h1>

      {items.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      {items.map((item) => (

        <div
          key={item.id}
          className="flex justify-between items-center border-b py-6"
        >

          <div className="flex items-center gap-6">

            <img
              src={item.product.images?.[0]?.url}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div>

              <p className="font-semibold">
                {item.product.title}
              </p>

              <p className="text-gray-500">
                £{item.product.price}
              </p>

              <p className="text-sm text-gray-400">
                Qty: {item.quantity}
              </p>

            </div>

          </div>

          <Button
            variant="destructive"
            onClick={() => removeItem(item.id)}
          >
            Remove
          </Button>

        </div>
      ))}

      {items.length > 0 && (

        <div className="mt-10 flex justify-between items-center">

          <p className="text-xl font-bold">
            Total: £{total.toFixed(2)}
          </p>

          <a href="/checkout">
            <Button className="bg-[#C8102E]">
              Checkout
            </Button>
          </a>

        </div>

      )}

    </div>
  )
}