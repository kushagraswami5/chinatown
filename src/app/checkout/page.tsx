"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<any[]>([])
  const [cart, setCart] = useState<any>(null)
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    Promise.all([api.get("/address"), api.get("/cart")])
      .then(([addrRes, cartRes]) => {
        setAddresses(addrRes.data)
        setCart(cartRes.data)
      })
      .catch(() => toast.error("Failed to load checkout data"))
      .finally(() => setLoading(false))
  }, [])

  const placeOrder = async () => {
    if (!selected) { toast.error("Please select a delivery address"); return }
    try {
      setPlacing(true)
      await api.post("/checkout", { addressId: selected })
      toast.success("Order placed successfully!")
      router.push("/orders")
    } catch (err) {
      toast.error("Checkout failed. Please try again.")
    } finally {
      setPlacing(false)
    }
  }

  const items = cart?.items || []
  const subtotal = items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0)
  const vat = subtotal * 0.2
  const shipping = 10
  const total = subtotal + vat + shipping

  if (loading) return <p className="p-10 text-gray-500">Loading checkout...</p>

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-10">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-12">

        {/* Address selection */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-medium text-[#1a1208]">Delivery Address</h2>
            <button onClick={() => router.push("/address/new")} className="text-xs text-[#C8102E] hover:underline tracking-wide">
              + Add Address
            </button>
          </div>

          {addresses.length === 0 && (
            <p className="text-sm text-gray-400 mb-4">No addresses saved. Please add one.</p>
          )}

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} onClick={() => setSelected(addr.id)}
                className={`border p-4 rounded-lg cursor-pointer transition ${
                  selected === addr.id ? "border-[#C8102E] bg-red-50" : "border-gray-200 hover:border-gray-400"
                }`}>
                <p className="font-medium text-sm">{addr.fullName}</p>
                <p className="text-sm text-gray-500">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                <p className="text-sm text-gray-500">{addr.city}, {addr.postcode}</p>
                {addr.phone && <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <h2 className="font-medium text-[#1a1208] mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>{item.product.title} × {item.quantity}</span>
                <span>£{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#f0e6d6] pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>VAT (20%)</span><span>£{vat.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>£{shipping.toFixed(2)}</span></div>
            <div className="flex justify-between font-serif text-lg text-[#1a1208] border-t border-[#f0e6d6] pt-3 mt-3">
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={placeOrder} disabled={placing || items.length === 0}
            className="mt-6 bg-[#C8102E] hover:bg-[#a80d25] w-full">
            {placing ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  )
}
