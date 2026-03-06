"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {

  return (

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-12">

      <div>

        <motion.h1
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
        >
          Discover Authentic Chinese Products
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.3 }}
          className="mt-4 text-muted-foreground text-sm md:text-base max-w-md"
        >
          Premium tea, ceramics, and traditional goods curated
          for modern living across the UK.
        </motion.p>

        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.5 }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >

          <Link href="/products">
            <Button className="bg-[#C8102E] text-white w-full sm:w-auto px-8 py-5">
              Shop Now
            </Button>
          </Link>

          <Link href="/categories">
            <Button variant="outline" className="w-full sm:w-auto">
              Browse Categories
            </Button>
          </Link>

        </motion.div>

      </div>

      <div className="order-first md:order-last">
        <img
          src="/hero-product.jpeg"
          alt="Chinese products"
          className="rounded-xl shadow-lg w-full h-[220px] sm:h-[300px] md:h-[380px] object-cover"
        />
      </div>

    </section>

  )
}