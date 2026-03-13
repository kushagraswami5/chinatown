"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VendorSection(){

  return(

    <section className="bg-white py-16 md:py-24">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <motion.h2
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
        >
          Become a Vendor
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          transition={{ delay:0.2 }}
          className="text-muted-foreground mt-4 text-sm md:text-base max-w-xl mx-auto"
        >
          Join our marketplace and showcase authentic Chinese
          products to customers across the UK.
        </motion.p>

        <motion.div
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          transition={{ delay:0.4 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >

          <Link href="/vendor/register">
            <Button className="bg-[#C8102E] text-white w-full sm:w-auto px-8 py-5">
              Start Selling
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="w-full sm:w-auto">
              Vendor Login
            </Button>
          </Link>

        </motion.div>

      </div>

    </section>

  )
}