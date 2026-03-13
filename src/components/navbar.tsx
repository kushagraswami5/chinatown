"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  ChevronDown
} from "lucide-react"

export default function Navbar() {

  const router = useRouter()

  const [query,setQuery] = useState("")
  const [suggestions,setSuggestions] = useState<any[]>([])
  const [showSuggestions,setShowSuggestions] = useState(false)

  const [token,setToken] = useState<string | null>(null)
  const [mounted,setMounted] = useState(false)

  const [mobileOpen,setMobileOpen] = useState(false)
  const [accountOpen,setAccountOpen] = useState(false)
  const [catOpen,setCatOpen] = useState(false)

  const [cartCount] = useState(2)
  const [wishCount] = useState(3)

  const searchRef = useRef<HTMLDivElement>(null)

  /* ---------------- AUTH ---------------- */

  useEffect(()=>{
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
    setMounted(true)
  },[])

  const logout = ()=>{
    localStorage.removeItem("token")
    window.location.href="/"
  }

  /* ---------------- SEARCH ---------------- */

  const handleSearch = (e:React.FormEvent)=>{
    e.preventDefault()

    if(!query.trim()) return

    router.push(`/products?search=${encodeURIComponent(query)}`)
    setShowSuggestions(false)
  }

  /* ---------------- LIVE SEARCH ---------------- */

  useEffect(()=>{

    if(!query.trim()){
      setSuggestions([])
      return
    }

    const debounce = setTimeout(async()=>{

      try{

        const res = await fetch(`/api/products?search=${query}&limit=5`)
        const data = await res.json()

        setSuggestions(data.products || [])
        setShowSuggestions(true)

      }catch(err){
        console.error(err)
      }

    },300)

    return ()=>clearTimeout(debounce)

  },[query])

  /* ---------------- CLICK OUTSIDE ---------------- */

  useEffect(()=>{

    const handleClickOutside = (event:any)=>{
      if(searchRef.current && !searchRef.current.contains(event.target)){
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown",handleClickOutside)

    return ()=>{
      document.removeEventListener("mousedown",handleClickOutside)
    }

  },[])

  if(!mounted) return null

  return (

<header className="sticky top-0 z-50 shadow">

{/* TOP BAR */}

<div className="bg-black text-white text-xs py-2 px-6 flex justify-between">
<span>CURRENCY: GBP (£)</span>
<span>DELIVERY: UK only</span>
</div>

{/* MAIN NAVBAR */}

<div className="bg-[#C8102E] text-white relative">

{/* FLOATING LOGO */}

<Link
href="/"
className="absolute left-6 top-1/2 -translate-y-1/2 z-20"
>

<Image
src="/logo.png"
alt="ChinaTown"
width={75}
height={75}
priority
className="object-contain drop-shadow-xl"
/>

</Link>

<div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-6 py-2 px-4">

{/* LOGO SPACER */}

<div className="w-[120px]" />

{/* SEARCH BAR */}

<div ref={searchRef} className="relative w-full">

<form
onSubmit={handleSearch}
className="flex w-full bg-white rounded shadow-lg overflow-hidden"
>

<input
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search Chinese products..."
className="flex-1 px-4 py-2 text-black outline-none"
/>

<button
type="submit"
className="bg-black px-6 text-white font-medium"
>
SEARCH
</button>

</form>

{/* LIVE SEARCH */}

{showSuggestions && suggestions.length>0 &&(

<div className="absolute top-12 w-full bg-white text-black shadow-lg rounded z-50">

{suggestions.map((product:any)=>(

<div
key={product.id}
onClick={()=>router.push(`/products/${product.id}`)}
className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
>

<img
src={product.images?.[0]?.url || "/placeholder.png"}
className="w-10 h-10 object-cover rounded"
/>

<div className="flex flex-col text-sm">

<span className="font-medium">
{product.title}
</span>

<span className="text-gray-500 text-xs">
£{product.price}
</span>

</div>

</div>

))}

</div>

)}

</div>

{/* RIGHT ICONS */}

<div className="flex justify-end items-center gap-6">

{/* ACCOUNT */}

<div className="relative hidden md:block">

<button
onClick={()=>setAccountOpen(!accountOpen)}
className="flex flex-col items-center text-xs"
>
<User size={20}/>
Account
</button>

{accountOpen &&(

<div className="absolute right-0 mt-2 w-40 bg-white text-black shadow rounded">

{!token ?(

<>

<Link href="/login" className="block px-4 py-2 hover:bg-gray-100">
Login
</Link>

<Link href="/register" className="block px-4 py-2 hover:bg-gray-100">
Register
</Link>

</>

):( 

<>

<Link href="/account" className="block px-4 py-2 hover:bg-gray-100">
My Account
</Link>

<button
onClick={logout}
className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>
Logout
</button>

</>

)}

</div>

)}

</div>

{/* WISHLIST */}

<Link href="/wishlist" className="relative flex flex-col items-center text-xs">

<Heart size={20}/>
Wishlist

{wishCount>0 &&(

<span className="absolute -top-1 -right-2 bg-black text-white text-[10px] px-1 rounded">
{wishCount}
</span>

)}

</Link>

{/* CART */}

<Link href="/cart" className="relative flex flex-col items-center text-xs">

<ShoppingCart size={20}/>
Cart

{cartCount>0 &&(

<span className="absolute -top-1 -right-2 bg-black text-white text-[10px] px-1 rounded">
{cartCount}
</span>

)}

</Link>

<button
className="md:hidden"
onClick={()=>setMobileOpen(!mobileOpen)}
>
<Menu/>
</button>

</div>

</div>

</div>

{/* CATEGORY NAV */}

<div className="bg-white border-b">

<div className="max-w-7xl mx-auto flex items-center gap-8 px-4 py-3 text-sm font-medium">

<Link href="/products">SHOP ALL</Link>

<div className="relative">

<button
onClick={()=>setCatOpen(!catOpen)}
className="flex items-center gap-1"
>
CATEGORIES
<ChevronDown size={16}/>
</button>

{catOpen &&(

<div className="absolute top-8 bg-white shadow rounded w-48">

<Link href="/category/tea" className="block px-4 py-2 hover:bg-gray-100">
Tea & Teaware
</Link>

<Link href="/category/decor" className="block px-4 py-2 hover:bg-gray-100">
Home Decor
</Link>

<Link href="/category/fashion" className="block px-4 py-2 hover:bg-gray-100">
Fashion
</Link>

<Link href="/category/beauty" className="block px-4 py-2 hover:bg-gray-100">
Beauty
</Link>

</div>

)}

</div>

<Link href="/new">NEW ARRIVALS</Link>
<Link href="/brands">BRANDS</Link>
<Link href="/gifts">GIFTS</Link>

</div>

</div>

{/* MOBILE MENU */}

{mobileOpen &&(

<div className="md:hidden bg-white border-t p-4 flex flex-col gap-4">

<Link href="/products">Shop All</Link>
<Link href="/categories">Categories</Link>
<Link href="/new">New Arrivals</Link>
<Link href="/brands">Brands</Link>
<Link href="/gifts">Gifts</Link>

</div>

)}

</header>

)
}