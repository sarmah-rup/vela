import Image from "next/image";

// A continuously scrolling row of on-model shots with brand tags, in the
// spirit of an ecommerce AI gallery. Images are free-licensed placeholders.
const shots = [
  { src: "/img/ip/model-1.png", brand: "Marisol" },
  { src: "/img/ip/model-10.png", brand: "Cadence" },
  { src: "/img/ip/model-20.png", brand: "Tindra" },
  { src: "/img/ip/onmodel-jacket-1.png", brand: "Northwind" },
  { src: "/img/ip/model-3.png", brand: "Atelier 9" },
  { src: "/img/ip/model-5.png", brand: "Saola" },
  { src: "/img/ip/model-12.png", brand: "Kestrel" },
  { src: "/img/ip/model-2.png", brand: "Florarama" },
  { src: "/img/ip/model-25.png", brand: "Loulou" },
  { src: "/img/ip/model-30.png", brand: "Meister" },
];

export function ShowcaseStrip() {
  const row = [...shots, ...shots];
  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="marquee flex w-max gap-4">
        {row.map((s, i) => (
          <figure
            key={`${s.brand}-${i}`}
            className="media group relative h-72 w-56 shrink-0 overflow-hidden sm:h-80 sm:w-64"
          >
            <Image
              src={s.src}
              alt={`${s.brand} on-model shot (placeholder)`}
              fill
              sizes="256px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-pill bg-black/55 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white backdrop-blur">
              {s.brand}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
