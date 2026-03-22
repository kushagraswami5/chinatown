"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX:
// 1. No auth check — unauthenticated users saw an empty broken cart
// 2. No quantity update UI — spec requires being able to change quantity
// 3. Variant display showed "null / null" when variant had Default values

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    try {
      const res = await api.get("/cart")
      setItems(res.data?.items || [])
    } catch (err: any) {
      if (err?.response?.status === 401) router.push("/login")
      else toast.error("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`)
      toast.success("Item removed")
      fetchCart()
    } catch {
      toast.error("Failed to remove item")
    }
  }

  // BUG FIX: added quantity update
  const updateQty = async (item: any, delta: number) => {
    const newQty = item.quantity + delta
    if (newQty < 1) { removeItem(item.id); return }
    try {
      // Re-add item with delta (API increments existing)
      if (delta > 0) {
        await api.post("/cart", { productId: item.productId, variantId: item.variantId, quantity: delta })
      } else {
        // Decrease: delete and re-add with new quantity
        await api.delete(`/cart/${item.id}`)
        await api.post("/cart", { productId: item.productId, variantId: item.variantId, quantity: newQty })
      }
      fetchCart()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update quantity")
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (item.product?.discountPrice ?? item.product?.price ?? 0) * item.quantity, 0)
  const vat = subtotal * 0.2
  const shipping = items.length > 0 ? 10 : 0
  const total = subtotal + vat + shipping

  if (loading) return <p className="p-10 text-gray-500">Loading cart...</p>

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-10">Your Cart</h1>

      {items.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button className="bg-[#C8102E] hover:bg-[#a80d25]">Browse Products</Button>
          </Link>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border-b border-[#f0e6d6] py-6">
          <div className="flex items-center gap-5">
            <img
              src={item.product?.images?.[0]?.url || "/placeholder.png"}
              alt={item.product?.title}
              className="w-20 h-20 object-cover rounded border border-gray-100"
            />
            <div>
              <p className="font-medium text-[#1a1208]">{item.product?.title}</p>
              {/* BUG FIX: don't show "Default / Default" variant */}
              {item.variant && item.variant.size !== "Default" && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.variant.size}{item.variant.color && item.variant.color !== "Default" ? ` / ${item.variant.color}` : ""}
                </p>
              )}
              <p className="text-sm text-[#c8a96e] mt-1">
                £{(item.product?.discountPrice ?? item.product?.price ?? 0).toFixed(2)} each
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quantity controls */}
            <div className="flex items-center border border-gray-200 rounded">
              <button onClick={() => updateQty(item, -1)} className="px-3 py-1 text-gray-500 hover:text-[#C8102E] transition-colors">−</button>
              <span className="px-3 py-1 text-sm font-medium text-[#1a1208] min-w-[32px] text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item, 1)} className="px-3 py-1 text-gray-500 hover:text-[#C8102E] transition-colors">+</button>
            </div>
            <p className="font-serif text-base text-[#1a1208] w-20 text-right">
              £{((item.product?.discountPrice ?? item.product?.price ?? 0) * item.quantity).toFixed(2)}
            </p>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={() => removeItem(item.id)}>✕</Button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-10 ml-auto max-w-xs w-full">
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>VAT (20%)</span><span>£{vat.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>£{shipping.toFixed(2)}</span></div>
            <div className="flex justify-between font-serif text-lg text-[#1a1208] border-t border-[#f0e6d6] pt-3 mt-3">
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="bg-[#C8102E] hover:bg-[#a80d25] w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
