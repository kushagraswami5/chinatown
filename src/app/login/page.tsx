"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!email || !password) { toast.error("Please enter email and password"); return }
    try {
      setLoading(true)
      const res = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      toast.success("Welcome back!")
      const role = res.data.user.role
      router.push(role === "VENDOR" ? "/vendor" : "/products")
    } catch (err) {
      toast.error("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <h1 className="font-serif text-3xl text-[#1a1208] mb-2">Login</h1>
      <p className="text-sm text-gray-400 mb-8">Welcome back to ChinaTown</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="border border-gray-200 p-3 w-full mb-4 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && login()}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="border border-gray-200 p-3 w-full mb-6 outline-none focus:border-[#C8102E] transition-colors"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && login()}
      />

      <Button onClick={login} disabled={loading} className="bg-[#C8102E] hover:bg-[#a80d25] w-full mb-4">
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <Link href="/register" className="text-[#C8102E] hover:underline">Register</Link>
      </p>
    </div>
  )
}
