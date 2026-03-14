"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react"
import api from "@/lib/api"

export default function Navbar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
    setMounted(true)

    // Fetch real cart count if logged in
    if (storedToken) {
      api.get("/cart")
        .then((res) => {
          const count = res.data?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
          setCartCount(count)
        })
        .catch(() => {})
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/products?search=${encodeURIComponent(query)}`)
    setShowSuggestions(false)
  }

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return }
    const debounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${query}&limit=5`)
        const data = await res.json()
        setSuggestions(data.products || [])
        setShowSuggestions(true)
      } catch (err) { console.error(err) }
    }, 300)
    return () => clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    const handler = (e: any) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50">

      {/* TOP BAR */}
      <div className="bg-[#111] text-[#c8a96e] text-[10px] tracking-[0.12em] py-1.5 px-8 flex justify-between">
        <span>CURRENCY: GBP (£)</span>
        <span className="hidden md:block">✦ FREE UK DELIVERY OVER £50 ✦</span>
        <span>UK DELIVERY ONLY</span>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-[#1a0a0a] px-6 md:px-8 flex items-center gap-6 relative">

        {/* LOGO */}
        <Link href="/" className="shrink-0 py-4">
          <span className="font-serif text-xl tracking-wide text-[#c8a96e]">
            China<em className="not-italic text-white">Town</em>
          </span>
        </Link>

        <div className="hidden md:block w-px h-8 bg-[#3a1a1a]" />

        {/* SEARCH */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearch} className="flex bg-[#2a1212] border border-[#4a2020] overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search authentic Chinese products..."
              className="flex-1 px-4 py-2.5 bg-transparent text-[#f5e8d0] placeholder-[#7a5a4a] text-sm outline-none"
            />
            <button type="submit" className="bg-[#C8102E] px-5 text-white text-[10px] tracking-[0.1em] font-medium hover:bg-[#a80d25] transition-colors">
              SEARCH
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 border border-gray-100">
              {suggestions.map((product: any) => (
                <div key={product.id} onClick={() => { router.push(`/products/${product.id}`); setShowSuggestions(false) }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#fdf8f0] cursor-pointer border-b border-gray-50 last:border-0">
                  <img src={product.images?.[0]?.url || "/placeholder.png"} className="w-10 h-10 object-cover border border-gray-100" alt={product.title} />
                  <div>
                    <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                    <p className="text-xs text-[#c8a96e] font-medium">£{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-5 ml-auto">

          <div className="relative hidden md:block">
            <button onClick={() => setAccountOpen(!accountOpen)} className="flex flex-col items-center gap-1 text-[#c8a96e] hover:text-white transition-colors">
              <User size={18} />
              <span className="text-[9px] tracking-[0.08em]">Account</span>
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl border border-gray-100 z-50">
                {!token ? (
                  <>
                    <Link href="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#fdf8f0] hover:text-[#c8102e] transition-colors border-b border-gray-50">Login</Link>
                    <Link href="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#fdf8f0] hover:text-[#c8102e] transition-colors">Register</Link>
                  </>
                ) : (
                  <>
                    <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#fdf8f0] hover:text-[#c8102e] transition-colors border-b border-gray-50">My Account</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#fdf8f0] hover:text-[#c8102e] transition-colors">Logout</button>
                  </>
                )}
              </div>
            )}
          </div>

          <Link href="/cart" className="relative flex flex-col items-center gap-1 text-[#c8a96e] hover:text-white transition-colors">
            <ShoppingCart size={18} />
            <span className="text-[9px] tracking-[0.08em]">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C8102E] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </Link>

          <button className="md:hidden text-[#c8a96e]" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* CATEGORY NAV */}
      <div className="bg-white border-b border-[#f0e8d8] hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-8 px-8 text-[11px] tracking-[0.1em]">
          <Link href="/products" className="py-3 text-[#5a3a2a] hover:text-[#C8102E] transition-colors border-b-2 border-transparent hover:border-[#C8102E] -mb-px">SHOP ALL</Link>
          <div className="relative">
            <button onClick={() => setCatOpen(!catOpen)} className="flex items-center gap-1 py-3 text-[#5a3a2a] hover:text-[#C8102E] transition-colors">
              CATEGORIES <ChevronDown size={12} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 z-50">
                {[["Tea & Teaware", "/category/tea"], ["Home Decor", "/category/decor"], ["Fashion", "/category/fashion"], ["Beauty", "/category/beauty"], ["Snacks", "/category/snacks"], ["Herbs", "/category/herbs"]].map(([label, href]) => (
                  <Link key={href} href={href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fdf8f0] hover:text-[#c8102e] transition-colors border-b border-gray-50 last:border-0">{label}</Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/new" className="py-3 text-[#5a3a2a] hover:text-[#C8102E] transition-colors border-b-2 border-transparent hover:border-[#C8102E] -mb-px">NEW ARRIVALS</Link>
          <Link href="/brands" className="py-3 text-[#5a3a2a] hover:text-[#C8102E] transition-colors border-b-2 border-transparent hover:border-[#C8102E] -mb-px">BRANDS</Link>
          <Link href="/gifts" className="py-3 text-[#5a3a2a] hover:text-[#C8102E] transition-colors border-b-2 border-transparent hover:border-[#C8102E] -mb-px">GIFTS</Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#1a0a0a] border-t border-[#3a1a1a] p-6 flex flex-col gap-5">
          <form onSubmit={handleSearch} className="flex bg-[#2a1212] border border-[#4a2020] overflow-hidden">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="flex-1 px-4 py-2.5 bg-transparent text-[#f5e8d0] placeholder-[#7a5a4a] text-sm outline-none" />
            <button type="submit" className="bg-[#C8102E] px-4 text-white text-xs">GO</button>
          </form>
          {[["Shop All", "/products"], ["New Arrivals", "/new"], ["Categories", "/categories"], ["Brands", "/brands"], ["Gifts", "/gifts"]].map(([label, href]) => (
            <Link key={href} href={href} className="text-[#c8a96e] text-sm tracking-wider hover:text-white transition-colors">{label}</Link>
          ))}
          <div className="border-t border-[#3a1a1a] pt-4 flex flex-col gap-3">
            {!token ? (
              <><Link href="/login" className="text-[#c8a96e] text-sm">Login</Link><Link href="/register" className="text-[#c8a96e] text-sm">Register</Link></>
            ) : (
              <button onClick={logout} className="text-left text-[#c8a96e] text-sm">Logout</button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
