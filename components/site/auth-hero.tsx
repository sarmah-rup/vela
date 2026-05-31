import Image from "next/image";
import { DevTag } from "@/components/ui/dev-tag";

// Auth-screen imagery, kept deliberately simple: one static on-model shot filling
// the full-height left column (to the top, behind the menu) plus a headline and a
// dev cue. No rotation, fade, or scrim — just a reliably visible image.
export function AuthHero() {
  return (
    <div className="relative hidden h-full overflow-hidden bg-ink lg:block">
      <Image
        src="/img/ip2/69773c05e94e992c715a0315_Botika_Homepage_BruneteAIModel.avif"
        alt="AI-generated on-model look"
        fill
        priority
        sizes="65vw"
        className="object-cover object-bottom"
      />

      <DevTag path="/generate/image/v1" prompt="brunette model, warm studio tone, editorial..." corner="br" />

      <h2 className="absolute inset-x-0 bottom-0 max-w-2xl p-12 font-display text-4xl font-medium leading-[1.06] tracking-tight text-fill sm:text-5xl">
        The image AI API for
        <br />
        fashion and ecommerce.
      </h2>
    </div>
  );
}
