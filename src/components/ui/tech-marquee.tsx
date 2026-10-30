import * as React from "react"

const TECH_ITEMS = [
  { name: "Python", dot: "#C83E31" },
  { name: "Kotlin", dot: "#27593E" },
  { name: "TypeScript", dot: "#163524" },
  { name: "React 19", dot: "#C83E31" },
  { name: "Jetpack Compose", dot: "#27593E" },
  { name: "Next.js & Vite", dot: "#163524" },
  { name: "Flask", dot: "#C83E31" },
  { name: "Tailwind CSS", dot: "#27593E" },
  { name: "On-Device SLM", dot: "#C83E31" },
  { name: "Google Gemini API", dot: "#27593E" },
  { name: "Node.js & Express", dot: "#163524" },
  { name: "Room + SQLCipher", dot: "#C83E31" },
  { name: "Git & Linux", dot: "#27593E" },
]

export function TechMarquee() {
  const doubled = [...TECH_ITEMS, ...TECH_ITEMS]
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-2/60 py-3.5">
      <style>{`
        @keyframes yasinMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-yasin-marquee {
          display: flex;
          width: max-content;
          animation: yasinMarquee 28s linear infinite;
        }
        .animate-yasin-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-yasin-marquee { animation: none; }
        }
      `}</style>
      <div className="animate-yasin-marquee gap-3 px-4">
        {doubled.map((item, idx) => (
          <span
            key={item.name + idx}
            aria-hidden={idx >= TECH_ITEMS.length}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-ink"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.dot }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  )
}
