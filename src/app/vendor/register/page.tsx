"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// BUG FIX: replaced alert() with toast, added input validation, added loading state,
// added redirect after registration, matched brand styles
export default function VendorRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const register = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields")
      return
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    try {
      setLoading(true)
      await api.post("/auth/register", { ...form, role: "VENDOR" })
      toast.success("Vendor account created! Please log in.")
      router.push("/login")
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Registration failed"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-2">Become a Vendor</h1>
      <p className="text-sm text-gray-400 mb-8">Sell authentic Chinese products on ChinaTown</p>

      <input
        placeholder="Full Name"
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        className="border border-gray-200 p-3 w-full mb-6 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button onClick={register} disabled={loading} className="bg-[#C8102E] hover:bg-[#a80d25] w-full mb-4">
        {loading ? "Creating account..." : "Create Vendor Account"}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-[#C8102E] hover:underline">Login</Link>
      </p>
    </div>
  )
}
