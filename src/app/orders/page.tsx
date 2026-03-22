"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"


const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-yellow-50 text-yellow-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    api.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        if (err?.response?.status === 401) router.push("/login")
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <p className="p-10 text-gray-500">Loading orders...</p>

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-10">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No orders yet</p>
          <p className="text-sm mb-6">Your completed orders will appear here.</p>
          <Link href="/products">
            <Button className="bg-[#C8102E] hover:bg-[#a80d25]">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        orders.map((order: any) => (
          <div key={order.id} className="border border-[#f0e6d6] p-6 mb-4 rounded-xl">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order</p>
                <p className="font-mono text-sm text-gray-600">#{order.id.slice(0, 8)}…</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.orderStatus] || ""}`}>
                  {order.orderStatus}
                </span>
                <p className="font-serif text-lg text-[#1a1208]">£{Number(order.totalAmount).toFixed(2)}</p>
              </div>
            </div>

            {order.items?.length > 0 && (
              <div className="border-t border-[#f0e6d6] pt-4 space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.product?.title ?? "Product"} × {item.quantity}</span>
                    <span>£{Number(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#f0e6d6] mt-4 pt-4 flex gap-6 text-xs text-gray-400 flex-wrap">
              <span>VAT: £{Number(order.VAT).toFixed(2)}</span>
              <span>Shipping: £{Number(order.shippingCost).toFixed(2)}</span>
              {order.deliveryAddress && (
                <span>{order.deliveryAddress.city}, {order.deliveryAddress.postcode}</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
