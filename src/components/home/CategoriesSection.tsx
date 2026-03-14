import Image from "next/image"
import Link from "next/link"

const categories = [
  { name: "Tea", image: "/categories/tea.jpeg", href: "/category/tea", count: "48 products" },
  { name: "Snacks", image: "/categories/snacks.jpeg", href: "/category/snacks", count: "72 products" },
  { name: "Decor", image: "/categories/decor.jpeg", href: "/category/decor", count: "34 products" },
  { name: "Kitchen", image: "/categories/kitchen.jpeg", href: "/category/kitchen", count: "56 products" },
  { name: "Herbs", image: "/categories/herbs.jpeg", href: "/category/herbs", count: "29 products" },
  { name: "Noodles", image: "/categories/noodles.jpeg", href: "/category/noodles", count: "41 products" },
]

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

      <div className="flex items-baseline justify-between mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-[#1a1208]">Browse by Category</h2>
        <Link href="/products" className="text-[11px] tracking-[0.1em] text-[#C8102E] hover:underline">VIEW ALL CATEGORIES →</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href}>
            <div className="relative rounded overflow-hidden cursor-pointer group aspect-[3/4]">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,5,5,0.85)] via-[rgba(20,5,5,0.15)] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-medium tracking-[0.08em] uppercase">{cat.name}</p>
                <p className="text-[#c8a96e] text-[10px] mt-0.5">{cat.count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}
