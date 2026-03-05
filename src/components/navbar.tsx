"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {

  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
    setMounted(true)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    window.location.href = "/"
  }

  if (!mounted) return null

  return (

    <nav className="flex justify-between items-center px-8 py-5 border-b bg-white">

      <Link href="/" className="text-xl font-bold text-[#C8102E]">
        ChinaTown
      </Link>

      <div className="flex items-center gap-6">

        <Link href="/products">Products</Link>

        <Link href="/cart">
          <ShoppingCart />
        </Link>

        {!token ? (
          <>
            <Link href="/login">
              <Button variant="outline">
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button className="bg-[#C8102E] text-white">
                Register
              </Button>
            </Link>
          </>
        ) : (
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        )}

      </div>

    </nav>
  )
}