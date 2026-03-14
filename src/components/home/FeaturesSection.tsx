import { ShieldCheck, Truck, Star } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Certified Authentic",
    desc: "Every product verified for Chinese origin and quality craftsmanship.",
  },
  {
    icon: Truck,
    title: "UK-Wide Delivery",
    desc: "Ships from our local UK warehouse in 2–4 business days.",
  },
  {
    icon: Star,
    title: "Premium Curation",
    desc: "Handpicked from trusted heritage vendors across China.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-white border-b border-[#f0e8d8]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#f0e8d8]">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4 px-8 py-7">
            <div className="w-10 h-10 rounded-full bg-[#fdf5e8] flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#c8a96e]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#1a1208]">{title}</h4>
              <p className="text-xs text-[#8a7060] mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
