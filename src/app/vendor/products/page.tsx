"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VendorProducts(){

  return(

    <div className="max-w-6xl mx-auto py-16">

      <div className="flex justify-between mb-10">

        <h1 className="text-3xl font-bold">
          Your Products
        </h1>

        <Link href="/vendor/products/new">
          <Button className="bg-[#C8102E]">
            Add Product
          </Button>
        </Link>

      </div>

      <p className="text-gray-500">
        Product list will appear here.
      </p>

    </div>
  )
}