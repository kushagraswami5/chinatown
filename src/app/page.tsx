"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {

  return (
    <div className="chinese-bg min-h-screen">

      {/* HERO */}

      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">

        <motion.h1
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
          className="text-5xl md:text-6xl font-bold"
        >
          Discover Chinese Elegance
        </motion.h1>

        <motion.p
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.3 }}
          className="mt-6 max-w-xl text-gray-600"
        >
          Luxury tea, ceramics, and traditional goods curated
          for modern living in the UK.
        </motion.p>

        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.6 }}
          className="mt-10 flex gap-4"
        >

          <Link href="/products">
            <Button className="bg-[#C8102E] text-white px-8 py-6">
              Explore Collection
            </Button>
          </Link>

          <Link href="/register">
            <Button variant="outline">
              Join Now
            </Button>
          </Link>

        </motion.div>

      </section>


      {/* FEATURE SECTION */}

      <section className="max-w-6xl mx-auto py-20 grid md:grid-cols-3 gap-12 text-center">

        <div>
          <h3 className="font-bold text-xl">
            Authentic Heritage
          </h3>

          <p className="text-gray-600 mt-4">
            Traditional Chinese craftsmanship curated for
            modern homes.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl">
            Premium Quality
          </h3>

          <p className="text-gray-600 mt-4">
            Every product selected for beauty, durability,
            and authenticity.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl">
            UK Delivery
          </h3>

          <p className="text-gray-600 mt-4">
            Secure shipping across the UK with premium
            packaging.
          </p>
        </div>

      </section>


      {/* VENDOR SECTION */}

      <section className="bg-white py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <motion.h2
            initial={{ opacity:0, y:30 }}
            whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.6 }}
            className="text-4xl font-bold"
          >
            Become a Vendor
          </motion.h2>

          <motion.p
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            transition={{ delay:0.2 }}
            className="text-gray-600 mt-6 max-w-2xl mx-auto"
          >
            Join our marketplace and showcase authentic Chinese
            products to customers across the UK. Grow your
            business with our premium platform.
          </motion.p>

          <motion.div
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            transition={{ delay:0.4 }}
            className="mt-10 flex justify-center gap-6"
          >

            <Link href="/vendor/register">
              <Button className="bg-[#C8102E] text-white px-8 py-6">
                Start Selling
              </Button>
            </Link>

            <Link href="/vendor/login">
              <Button variant="outline">
                Vendor Login
              </Button>
            </Link>

          </motion.div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="py-10 text-center text-gray-500 border-t">

        © {new Date().getFullYear()} ChinaTown Marketplace

      </footer>

    </div>
  )
}