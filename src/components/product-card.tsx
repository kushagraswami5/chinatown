"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductCard({ product }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white border border-[#f0e6d6] hover:shadow-[0_8px_32px_rgba(120,60,30,0.10)] transition-all duration-300 cursor-pointer"
    >
      <Link href={`/products/${product.id}`}>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#faf6f0]">
          <img
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Sale badge */}
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-[#C8102E] text-white text-[9px] tracking-[0.1em] px-2.5 py-1 uppercase">
              Sale
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#fdf5e8]"
          >
            <Heart size={14} className="text-[#C8102E]" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category?.name && (
            <p className="text-[10px] tracking-[0.12em] text-[#c8a96e] uppercase mb-1">{product.category.name}</p>
          )}
          <h3 className="text-sm text-[#1a1208] leading-snug mb-3 line-clamp-2 font-normal">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base text-[#1a1208]">£{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-[#b09a8a] line-through">£{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={(e) => { e.preventDefault(); }}
              className="w-8 h-8 bg-[#C8102E] flex items-center justify-center hover:bg-[#a80d25] transition-colors"
            >
              <ShoppingCart size={14} className="text-white" />
            </button>
          </div>
        </div>

      </Link>
    </motion.div>
  );
}
