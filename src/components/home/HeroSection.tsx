"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[540px] md:h-[640px] overflow-hidden bg-[#1a0a0a]">

      {/* Background image */}
      <Image src="/banner.jpg" alt="ChinaTown banner" fill priority quality={100} className="object-cover opacity-40" />

      {/* Subtle diagonal pattern */}
      <div className="absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(200,169,110,0.04) 0, rgba(200,169,110,0.04) 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
        <div className="max-w-xl">

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-3 text-[#c8a96e] text-[10px] tracking-[0.2em] uppercase mb-6">
            <span className="w-8 h-px bg-[#c8a96e] inline-block" />
            Est. Authentic Imports · UK Warehouse
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05] mb-6">
            Authentic<br />
            <em className="text-[#c8a96e] not-italic">Chinese Treasures</em><br />
            Delivered to You
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#9a8070] text-sm md:text-base leading-relaxed mb-10 max-w-sm font-light">
            Curated heritage pieces, premium teas, and traditional craftsmanship — sourced and shipped from our UK warehouse.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <button className="bg-[#C8102E] text-white px-8 py-3.5 text-[11px] tracking-[0.12em] font-medium hover:bg-[#a80d25] transition-colors">
                SHOP NOW
              </button>
            </Link>
            <Link href="/products">
              <button className="border border-[#c8a96e] text-[#c8a96e] px-8 py-3.5 text-[11px] tracking-[0.12em] hover:bg-[#c8a96e] hover:text-[#1a0a0a] transition-colors">
                BROWSE CATEGORIES
              </button>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Decorative circle / character */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center">
        <div className="w-80 h-80 rounded-full border border-[rgba(200,169,110,0.18)] flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-[rgba(200,169,110,0.12)] bg-[rgba(200,169,110,0.05)] flex items-center justify-center">
            <span className="font-serif text-[90px] text-[rgba(200,169,110,0.30)] leading-none select-none">龍</span>
          </div>
        </div>
      </div>

    </section>
  )
}
