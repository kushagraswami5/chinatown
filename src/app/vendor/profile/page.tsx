"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"


export default function VendorProfile() {
  const [form, setForm] = useState({
    businessName: "",
    warehouseAddress: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [profileExists, setProfileExists] = useState(false)
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    api.get("/vendor/profile")
      .then((res) => {
        const p = res.data
        setForm({
          businessName: p.businessName || "",
          warehouseAddress: p.warehouseAddress || "",
          description: p.description || "",
        })
        setProfileExists(true)
        setApproved(p.approved)
      })
      .catch(() => {
        // Profile doesn't exist yet — show empty form
      })
      .finally(() => setFetching(false))
  }, [])

  const submit = async () => {
    if (!form.businessName || !form.warehouseAddress) {
      toast.error("Business name and warehouse address are required")
      return
    }
    try {
      setLoading(true)
      if (profileExists) {
        await api.patch("/vendor/profile", form)
        toast.success("Profile updated successfully!")
      } else {
        await api.post("/vendor/profile", form)
        toast.success("Vendor profile created! Pending admin approval.")
        setProfileExists(true)
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to save profile"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className="p-10 text-gray-500">Loading profile...</p>

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-2">Store Profile</h1>

      {profileExists && (
        <div className={`mb-6 text-sm px-4 py-2 rounded ${approved ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
          {approved ? "✓ Your store is approved and live" : "⏳ Pending admin approval"}
        </div>
      )}

      <input
        placeholder="Business Name *"
        value={form.businessName}
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
      />

      <input
        placeholder="UK Warehouse Address *"
        value={form.warehouseAddress}
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, warehouseAddress: e.target.value })}
      />

      <textarea
        placeholder="Store description"
        value={form.description}
        className="border border-gray-200 p-3 w-full mb-6 outline-none focus:border-[#C8102E] transition-colors min-h-[100px]"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Button onClick={submit} disabled={loading} className="bg-[#C8102E] hover:bg-[#a80d25] w-full">
        {loading ? "Saving..." : profileExists ? "Update Profile" : "Create Profile"}
      </Button>
    </div>
  )
}
