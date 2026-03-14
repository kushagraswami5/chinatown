"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-10 text-gray-500">Loading orders...</p>

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-10">Your Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">No orders yet</p>
          <p className="text-sm">Your completed orders will appear here.</p>
        </div>
      )}

      {orders.map((order: any) => (
        <div key={order.id} className="border border-[#f0e6d6] p-6 mb-4 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order</p>
              <p className="font-mono text-sm text-gray-600">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Total</p>
              <p className="font-serif text-lg text-[#1a1208]">£{Number(order.totalAmount).toFixed(2)}</p>
            </div>
          </div>

          {order.items?.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.product?.title ?? "Product"} × {item.quantity}</span>
                  <span>£{Number(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t mt-4 pt-4 flex gap-6 text-xs text-gray-400">
            <span>VAT: £{Number(order.VAT).toFixed(2)}</span>
            <span>Shipping: £{Number(order.shippingCost).toFixed(2)}</span>
            <span className="ml-auto">{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
