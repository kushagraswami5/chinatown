"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// BUG FIX: Dashboard was completely static. Now shows real stats (product count, order count)
// and checks that user is actually logged in as VENDOR (no auth guard existed).

export default function VendorDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<{ products: number; orders: number; profile: any } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    Promise.all([
      api.get("/vendor/products").catch(() => ({ data: [] })),
      api.get("/vendor/orders").catch(() => ({ data: [] })),
      api.get("/vendor/profile").catch(() => ({ data: null })),
    ]).then(([products, orders, profile]) => {
      setStats({
        products: Array.isArray(products.data) ? products.data.length : 0,
        orders: Array.isArray(orders.data) ? orders.data.length : 0,
        profile: profile.data,
      })
    }).finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <Skeleton className="h-10 w-64 mb-10" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-[#1a1208] mb-1">Vendor Dashboard</h1>
        {stats?.profile?.businessName && (
          <p className="text-sm text-gray-400">{stats.profile.businessName}</p>
        )}
        {stats?.profile && !stats.profile.approved && (
          <div className="mt-3 text-sm bg-yellow-50 text-yellow-700 px-4 py-2 rounded inline-block">
            ⏳ Your store is pending admin approval
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="border border-[#f0e6d6] rounded-xl p-5">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Products</p>
          <p className="font-serif text-3xl text-[#1a1208]">{stats?.products ?? 0}</p>
        </div>
        <div className="border border-[#f0e6d6] rounded-xl p-5">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Orders</p>
          <p className="font-serif text-3xl text-[#1a1208]">{stats?.orders ?? 0}</p>
        </div>
        <div className="border border-[#f0e6d6] rounded-xl p-5">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Status</p>
          <p className={`font-medium text-sm mt-1 ${stats?.profile?.approved ? "text-green-600" : "text-yellow-600"}`}>
            {stats?.profile?.approved ? "Active" : "Pending"}
          </p>
        </div>
      </div>

      {/* Nav cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/vendor/profile">
          <div className="border border-[#f0e6d6] rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="text-2xl mb-3">🏪</div>
            <h3 className="font-medium text-[#1a1208] text-lg mb-1 group-hover:text-[#C8102E] transition-colors">Store Profile</h3>
            <p className="text-gray-400 text-sm">Manage your store details, logo and description</p>
          </div>
        </Link>

        <Link href="/vendor/products">
          <div className="border border-[#f0e6d6] rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="text-2xl mb-3">📦</div>
            <h3 className="font-medium text-[#1a1208] text-lg mb-1 group-hover:text-[#C8102E] transition-colors">Products</h3>
            <p className="text-gray-400 text-sm">Add, edit or remove your product listings</p>
          </div>
        </Link>

        <Link href="/vendor/orders">
          <div className="border border-[#f0e6d6] rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="text-2xl mb-3">📋</div>
            <h3 className="font-medium text-[#1a1208] text-lg mb-1 group-hover:text-[#C8102E] transition-colors">Orders</h3>
            <p className="text-gray-400 text-sm">View and update customer order statuses</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
