"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX: /address/page.tsx was a duplicate of /address/new/page.tsx (both showed "Add Address" form).
// This page should LIST saved addresses and let the user navigate to add a new one.

export default function AddressPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/address")
      .then((res) => setAddresses(res.data))
      .catch(() => toast.error("Failed to load addresses"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-10 text-gray-500">Loading addresses...</p>

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#1a1208]">Saved Addresses</h1>
        <Button onClick={() => router.push("/address/new")} className="bg-[#C8102E] hover:bg-[#a80d25]">
          + Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-4">No addresses saved yet</p>
          <Button onClick={() => router.push("/address/new")} className="bg-[#C8102E] hover:bg-[#a80d25]">
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border border-[#f0e6d6] rounded-xl p-5">
              <p className="font-medium text-[#1a1208]">{addr.fullName}</p>
              <p className="text-sm text-gray-500">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
              <p className="text-sm text-gray-500">{addr.city}, {addr.postcode}</p>
              {addr.phone && <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
