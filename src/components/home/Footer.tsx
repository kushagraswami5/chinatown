import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0f0808]">
      <div className="max-w-7xl mx-auto px-8 pt-14 pb-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          <div>
            <p className="font-serif text-lg text-[#c8a96e] mb-3">China<em className="not-italic text-white">Town</em></p>
            <p className="text-xs text-[#7a6050] leading-relaxed max-w-[200px]">
              Authentic Chinese products curated and delivered across the United Kingdom from our local warehouse.
            </p>
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.15em] text-[#c8a96e] uppercase mb-4">Shop</h5>
            {[["New Arrivals", "/new"], ["All Products", "/products"], ["Categories", "/categories"], ["Brands", "/brands"]].map(([label, href]) => (
              <Link key={href} href={href} className="block text-xs text-[#7a6050] hover:text-[#c8a96e] transition-colors mb-2.5">{label}</Link>
            ))}
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.15em] text-[#c8a96e] uppercase mb-4">Support</h5>
            {[["Contact Us", "/contact"], ["Shipping Info", "/shipping"], ["Returns", "/returns"], ["FAQs", "/faqs"]].map(([label, href]) => (
              <Link key={href} href={href} className="block text-xs text-[#7a6050] hover:text-[#c8a96e] transition-colors mb-2.5">{label}</Link>
            ))}
          </div>

          <div>
            <h5 className="text-[10px] tracking-[0.15em] text-[#c8a96e] uppercase mb-4">Legal</h5>
            {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Cookie Policy", "/cookies"]].map(([label, href]) => (
              <Link key={href} href={href} className="block text-xs text-[#7a6050] hover:text-[#c8a96e] transition-colors mb-2.5">{label}</Link>
            ))}
          </div>

        </div>

        <div className="border-t border-[#2a1818] pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-[#5a4030]">© {new Date().getFullYear()} ChinaTown Marketplace. All rights reserved.</p>
          <p className="text-[11px] text-[#5a4030] tracking-widest">龍 · 福 · 壽</p>
        </div>

      </div>
    </footer>
  )
}
