import { CalendarClock, ShieldCheck, Wifi } from "lucide-react";

import { ContentContainer } from "@/components/layout/content-container";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Vetted for focus",
    description:
      "Every stay is reviewed for reliable wifi, quiet surroundings, and a proper desk setup — not just a pretty photo.",
  },
  {
    icon: Wifi,
    title: "Verified wifi speeds",
    description:
      "We publish real Mbps readings and quiet scores so you know what you're booking before you arrive.",
  },
  {
    icon: CalendarClock,
    title: "Flexible cancellation",
    description:
      "Plans change. Most properties offer full refunds up to 48 hours before check-in.",
  },
] as const;

const WhyLateralTravel = () => (
  <section className="py-18">
    <ContentContainer size="xl">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl tracking-[-0.02em] text-foreground">
          Travel differently
        </h2>
        <p className="mt-2.5 text-base text-muted-foreground">
          Why curious travelers choose Lateral Travel
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-4">
            <div className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
              <Icon className="size-5" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="leading-[1.65] text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>
    </ContentContainer>
  </section>
);

export { WhyLateralTravel };
