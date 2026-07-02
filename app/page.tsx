export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-24">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          Curated remote-work stays
        </p>
        <h1 className="text-balance font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-7xl">
          Work from places worth arriving for.
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          Lateral Travel helps focused travelers discover stays with reliable
          work setups, transparent availability and a checkout flow built for
          speed.
        </p>
      </section>
    </main>
  );
}
