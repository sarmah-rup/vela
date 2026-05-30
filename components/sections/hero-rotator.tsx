"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DevTag } from "@/components/ui/dev-tag";

// Rotating hero image, à la Botika: the on-model shot cross-fades through a
// set of AI-generated looks. Portrait crops (900×1470) so the model stays
// framed inside the tall hero card.
const looks = [
  {
    src: "/img/ip2/697a476b34d4315d5a3e2b99_Botika_Home_AIGeneratedModels_Header_2_Mobile.avif",
    brand: "Anna Nova",
    prompt: "full-body on-model, soft window light, linen set...",
  },
  {
    src: "/img/ip2/69773c05e94e992c715a0315_Botika_Homepage_BruneteAIModel.avif",
    brand: "Marisol",
    prompt: "brunette model, warm studio tone, editorial...",
  },
  {
    src: "/img/ip2/697a476bdb5b305997956a82_Botika_Home_AIGeneratedModels_Header_6_Mobile.avif",
    brand: "Northwind",
    prompt: "outdoor lifestyle, golden-hour denim...",
  },
  {
    src: "/img/ip2/69773c05ff330c75b2550fc3_Botika_Homepage_WhiteCurlyAIModel_Mobile.avif",
    brand: "Kestrel",
    prompt: "curly hair, clean pastel studio, beauty...",
  },
];

export function HeroRotator() {
  const [i, setI] = React.useState(0);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % looks.length), 8000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative h-[26rem] w-full overflow-hidden sm:h-[34rem] lg:h-[calc(37rem+10vh)] lg:w-[calc(100%+5rem)]">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={looks[i].src}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <Image
            src={looks[i].src}
            alt={`${looks[i].brand}, AI-generated on-model look`}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover object-bottom"
            priority={i === 0}
          />
          {/* Inside the cross-fading layer, so the prompt fades with its image. */}
          <DevTag path="/generate/image/v1" prompt={looks[i].prompt} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
