import { ContentContainer } from "@/components/layout/content-container";
import { DestinationCard } from "@/components/marketing/destination-card";

const DESTINATIONS = [
  {
    name: "Santorini",
    country: "Greece",
    count: 412,
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&q=75",
  },
  {
    name: "Kyoto",
    country: "Japan",
    count: 634,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&q=75",
  },
  {
    name: "Bali",
    country: "Indonesia",
    count: 1820,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=75",
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    count: 291,
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=500&q=75",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    count: 389,
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=500&q=75",
  },
] as const;

const PopularDestinations = () => (
  <section className="bg-warm py-16">
    <ContentContainer size="xl">
      <div className="mb-8">
        <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-foreground">
          Popular destinations
        </h2>
        <p className="mt-2 text-muted-foreground">
          Curated escapes for every kind of traveler
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {DESTINATIONS.map((destination) => (
          <DestinationCard key={destination.name} {...destination} />
        ))}
      </div>
    </ContentContainer>
  </section>
);

export { PopularDestinations };
