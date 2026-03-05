"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VendorDashboard() {

  return (

    <div className="max-w-6xl mx-auto py-16">

      <h1 className="text-3xl font-bold mb-10">
        Vendor Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Link href="/vendor/profile">
          <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
            <h3 className="font-bold text-xl">Store Profile</h3>
            <p className="text-gray-500 mt-2">
              Manage your store details
            </p>
          </div>
        </Link>

        <Link href="/vendor/products">
          <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
            <h3 className="font-bold text-xl">Products</h3>
            <p className="text-gray-500 mt-2">
              Manage your products
            </p>
          </div>
        </Link>

        <Link href="/vendor/orders">
          <div className="border rounded-xl p-6 hover:shadow-lg cursor-pointer">
            <h3 className="font-bold text-xl">Orders</h3>
            <p className="text-gray-500 mt-2">
              View customer orders
            </p>
          </div>
        </Link>

      </div>

    </div>
  )
}