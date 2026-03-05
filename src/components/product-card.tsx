"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white border rounded-xl shadow-md overflow-hidden cursor-pointer"
      >
        <img
          src={product.images?.[0]?.url}
          className="h-56 w-full object-cover"
        />

        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.title}</h3>

          <p className="text-[#C8102E] font-bold mt-2">
            £{product.price}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}