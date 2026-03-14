import Link from "next/link"
import ProductCard from "@/components/product-card"

export default function FeaturedProducts({ products }: any) {
  return (
    <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

      <div className="flex items-baseline justify-between mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-[#1a1208]">Featured Products</h2>
        <Link href="/products" className="text-[11px] tracking-[0.1em] text-[#C8102E] hover:underline">VIEW ALL →</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </section>
  )
}
