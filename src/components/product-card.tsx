"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/products/${product.id}`}>

      <motion.div
        whileHover={{ y: -6 }}
        className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer"
      >

        {/* Image Wrapper with fixed ratio */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">

          <img
            src={product.images?.[0]?.url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Product Info */}
          <div className="absolute bottom-3 left-3 right-3 text-white">

            <h3 className="font-semibold text-sm md:text-base line-clamp-2">
              {product.title}
            </h3>

            <p className="text-red-300 font-bold mt-1">
              £{product.price}
            </p>

          </div>

          {/* Add to cart */}
          <button
            className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md
            opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-[#C8102E] hover:text-white"
          >
            <ShoppingCart size={18} />
          </button>

        </div>

      </motion.div>

    </Link>
  );
}