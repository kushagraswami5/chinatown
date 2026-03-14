"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function VendorSection() {
  return (
    <section className="relative bg-[#1a0a0a] py-20 md:py-28 text-center overflow-hidden">

      {/* Decorative background character */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-serif text-[220px] text-[rgba(200,169,110,0.04)] leading-none">中</span>
      </div>

      <div className="relative max-w-2xl mx-auto px-4">

        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-[10px] tracking-[0.2em] text-[#c8a96e] mb-5 uppercase">
          Marketplace Partners
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-5">
          Become a Vendor
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-[#9a8070] text-sm md:text-base leading-relaxed mb-10 font-light">
          Join our curated marketplace and bring authentic Chinese products to customers across the UK. Simple onboarding, powerful tools.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/vendor/register">
            <button className="bg-[#C8102E] text-white px-8 py-3.5 text-[11px] tracking-[0.12em] hover:bg-[#a80d25] transition-colors w-full sm:w-auto">
              START SELLING
            </button>
          </Link>
          <Link href="/login">
            <button className="border border-[#c8a96e] text-[#c8a96e] px-8 py-3.5 text-[11px] tracking-[0.12em] hover:bg-[#c8a96e] hover:text-[#1a0a0a] transition-colors w-full sm:w-auto">
              VENDOR LOGIN
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
