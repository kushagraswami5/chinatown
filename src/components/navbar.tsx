"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {

  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

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
    <nav className="border-b bg-transparent">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        <Link href="/" className="text-lg md:text-xl font-bold text-[#C8102E]">
          ChinaTown
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link href="/products">Products</Link>

          <Link href="/cart">
            <ShoppingCart />
          </Link>

          {!token ? (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-6 flex flex-col gap-4">

          <Link href="/products">Products</Link>

          <Link href="/cart" className="flex items-center gap-2">
            <ShoppingCart size={18}/> Cart
          </Link>

          {!token ? (
            <>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button className="bg-[#C8102E] text-white w-full">
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
      )}

    </nav>
  )
}