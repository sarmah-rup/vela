import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const featured = {
  brand: "Printify",
  quote: "We saved 42% of time on editing and 28% on managing sellers",
  left: "/img/ip2/6976234b84e6fbece572e594_Botika_HomePage_Editorials.avif",
  right: "/img/ip2/697623e2c1bb8c1db4a9c872_Botika_Homepage_BotikaCreatorProgram.avif",
};

const testimonials = [
  {
    brand: "Rappi",
    quote:
      "ImagePipeline has been an awesome partner for Rappi. They helped us increase the number of on-model shots on our platform by 33%.",
    name: "Alain Abud",
    role: "Ops Manager, Rappi",
  },
  {
    brand: "Mixtiles",
    quote:
      "Using the ImagePipeline API, we've basically taken a shortcut. We don't have to worry about image quality, and we've solved common problems we faced with user-generated content.",
    name: "Ido Grosberg",
    role: "Engineering Lead, Mixtiles",
  },
  {
    brand: "Caranty",
    quote:
      "ImagePipeline has been an absolute game-changer for our online marketplace. Our website now showcases products at their best, giving us a competitive edge.",
    name: "Arturo Diaz",
    role: "CTO, Caranty",
  },
];

export function Testimonials() {
  return (
    <section className="bg-ink py-24 text-white">
      <Container className="flex flex-col gap-20">
        {/* Featured quote, flanked by peeking previews */}
        <Reveal>
          <div className="relative mx-auto flex max-w-5xl items-center justify-center">
            <div className="absolute left-0 top-1/2 hidden h-56 w-72 -translate-y-1/2 -rotate-[5deg] overflow-hidden rounded-2xl shadow-2xl lg:block">
              <Image src={featured.left} alt="" fill sizes="288px" className="object-cover" />
            </div>
            <div className="absolute right-0 top-1/2 hidden h-56 w-72 -translate-y-1/2 rotate-[5deg] overflow-hidden rounded-2xl shadow-2xl lg:block">
              <Image src={featured.right} alt="" fill sizes="288px" className="object-cover" />
            </div>
            <div className="relative z-10 w-full max-w-xl rounded-[28px] bg-[#e9e7ff] p-9 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-11">
              <span className="font-display text-lg font-bold tracking-tight">
                {featured.brand}
              </span>
              <p className="mt-6 font-display text-2xl font-semibold leading-snug sm:text-3xl">
                “{featured.quote} 😄”
              </p>
              <Link
                href="/customers"
                className="group mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
              >
                Read more
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Three testimonials */}
        <RevealGroup className="grid gap-12 md:grid-cols-3">
          {testimonials.map((t) => (
            <RevealItem key={t.brand}>
              <div className="flex h-full flex-col items-center gap-4 text-center">
                <span className="font-display text-xl font-bold tracking-tight">
                  {t.brand}
                </span>
                <p className="text-sm leading-relaxed text-white/55">{t.quote}</p>
                <div className="mt-auto flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
