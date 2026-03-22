"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX: was a static placeholder. Now fetches real orders from GET /api/vendor/orders
// and allows vendors to update order status.

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-yellow-50 text-yellow-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
}

export default function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await api.get("/vendor/orders")
      setOrders(res.data)
    } catch {
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId: string, orderStatus: string) => {
    try {
      await api.patch("/vendor/orders", { orderId, orderStatus })
      toast.success("Order status updated")
      fetchOrders()
    } catch {
      toast.error("Failed to update order")
    }
  }

  if (loading) return <p className="p-10 text-gray-500">Loading orders...</p>

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-10">Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No orders yet</p>
          <p className="text-sm mt-1">Orders from customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-[#f0e6d6] rounded-xl p-6">
              <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Order</p>
                  <p className="font-mono text-sm text-gray-600">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.user?.name} · {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.orderStatus] || ""}`}>
                    {order.orderStatus}
                  </span>
                  <select
                    className="text-xs border border-gray-200 p-1.5 rounded outline-none focus:border-[#C8102E]"
                    defaultValue=""
                    onChange={(e) => { if (e.target.value) updateStatus(order.id, e.target.value) }}
                  >
                    <option value="" disabled>Update status</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      {item.product?.images?.[0]?.url && (
                        <img src={item.product.images[0].url} className="w-8 h-8 object-cover rounded" alt="" />
                      )}
                      {item.product?.title} × {item.quantity}
                    </span>
                    <span>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.deliveryAddress && (
                <div className="border-t mt-4 pt-4 text-xs text-gray-400">
                  <span>Ship to: {order.deliveryAddress.fullName}, {order.deliveryAddress.line1}, {order.deliveryAddress.city} {order.deliveryAddress.postcode}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
