"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroSection() {

  return (

    <section className="relative w-full h-[520px] md:h-[620px] overflow-hidden">

      {/* Banner Background */}
      <Image
        src="/banner.jpg"
        alt="Chinese banner"
        fill
        priority
        quality={100}
        className="object-cover"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6">

        <div className="max-w-xl">

          <motion.h1
            initial={{ opacity:0, y:40 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7 }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-snug"
          >
            AUTHENTIC <br/>
            CHINESE TREASURES, <br/>
            DELIVERED FROM <br/>
            OUR UK WAREHOUSE.
          </motion.h1>

          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.4 }}
            className="mt-6"
          >
            <Link href="/products">
              <Button className="bg-[#D4AF37] text-black px-8 py-5 text-lg border border-black hover:bg-[#c19b2e]">
                SHOP NOW
              </Button>
            </Link>
          </motion.div>

        </div>

      </div>

    </section>

  )
}