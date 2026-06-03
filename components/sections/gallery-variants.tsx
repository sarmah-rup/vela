"use client";

import Image from "next/image";
import { DevTag } from "@/components/ui/dev-tag";

// "Every face here is AI generated" gallery — an angled 3D strip. The row
// glides sideways forever (the global `.marquee` keyframe translates the track
// to -50%, so the set is rendered twice and loops seamlessly) on a plane tilted
// in perspective. Hovering anywhere on the strip stops the scroll; hovering a
// tile zooms its image. Every tile carries a small prompt dev cue.

const faces = [
  { src: "/img/ip/shoot/image_01.png", brand: "Marisol", prompt: "emerald gown, on-model" },
  { src: "/img/ip/shoot/image_30.png", brand: "Tindra", prompt: "gold earrings, editorial" },
  { src: "/img/ip/shoot/image_08.png", brand: "Cadence", prompt: "tailored suit, on-model" },
  { src: "/img/ip/shoot/image_03.png", brand: "Saola", prompt: "magenta dress, seated" },
  { src: "/img/ip/shoot/image_37.png", brand: "Halden", prompt: "linen shirt, on-model" },
  { src: "/img/ip/shoot/image_19.png", brand: "Loulou", prompt: "velvet suit, on-model" },
  { src: "/img/ip/shoot/image_02.png", brand: "Atelier 9", prompt: "black blazer, on-model" },
  { src: "/img/ip/shoot/image_31.png", brand: "Kestrel", prompt: "blue shades, editorial" },
  { src: "/img/ip/shoot/image_16.png", brand: "Noor", prompt: "off-shoulder dress" },
  { src: "/img/ip/shoot/image_34.png", brand: "Wren", prompt: "sun hat, editorial" },
];

export function GalleryAngled() {
  const row = [...faces, ...faces];
  return (
    <div className="relative w-full overflow-hidden py-20 [perspective:1200px] sm:py-28">
      <div className="[transform:rotateX(8deg)_rotateZ(-3deg)]">
        <div className="marquee hover-pause flex w-max gap-5 [backface-visibility:hidden] [will-change:transform]">
          {row.map((f, i) => (
            <div
              key={i}
              className="relative h-80 w-60 shrink-0 overflow-hidden rounded-2xl shadow-[0_40px_70px_-30px_rgba(13,15,20,0.6)] transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.1] sm:h-[28rem] sm:w-72"
            >
              <Image
                src={f.src}
                alt={`${f.brand} on-model`}
                fill
                sizes="288px"
                className="object-cover object-top"
              />
              <DevTag prompt={f.prompt} corner="br" className="text-[10px]" />
            </div>
          ))}
        </div>
      </div>
      {/* Static gradient edge-fades (instead of a mask on the animating track,
          which would force a per-frame recomposite and stutter the scroll/zoom) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent sm:w-40" />
    </div>
  );
}
