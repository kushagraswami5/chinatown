"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX:
// 1. Replaced alert() with toast
// 2. Added validation for required fields
// 3. Used router.push instead of window.location.href
// 4. Added loading state
// 5. Matched brand styles (was completely unstyled)

export default function AddAddressPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!form.fullName || !form.line1 || !form.city || !form.postcode) {
      toast.error("Please fill in all required fields")
      return
    }
    // BUG FIX: basic UK postcode format validation
    if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(form.postcode.trim())) {
      toast.error("Please enter a valid UK postcode")
      return
    }
    try {
      setLoading(true)
      await api.post("/address", form)
      toast.success("Address saved!")
      router.push("/checkout")
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save address")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-2">Add Address</h1>
      <p className="text-sm text-gray-400 mb-8">UK delivery addresses only</p>

      <input placeholder="Full Name *" className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      <input placeholder="Address Line 1 *" className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, line1: e.target.value })} />
      <input placeholder="Address Line 2 (optional)" className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, line2: e.target.value })} />
      <input placeholder="City *" className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, city: e.target.value })} />
      <input placeholder="Postcode *" className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
      <input placeholder="Phone (optional)" className="border border-gray-200 p-3 w-full mb-6 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <Button onClick={submit} disabled={loading} className="bg-[#C8102E] hover:bg-[#a80d25] w-full">
        {loading ? "Saving..." : "Save Address"}
      </Button>
    </div>
  )
}
