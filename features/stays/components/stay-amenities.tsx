import {
  ChefHat,
  Clock3,
  Coffee,
  Croissant,
  Laptop2,
  PawPrint,
  SquareParking,
  Users,
  VolumeX,
  WashingMachine,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { StayAmenity } from "@/features/stays/types/stay";
import { humanizeLabel } from "@/lib/format";

const AMENITY_ICONS: Record<StayAmenity, LucideIcon> = {
  breakfast: Croissant,
  coffee: Coffee,
  "coworking-space": Users,
  desk: Laptop2,
  kitchen: ChefHat,
  "late-checkout": Clock3,
  parking: SquareParking,
  "pet-friendly": PawPrint,
  "quiet-zone": VolumeX,
  washer: WashingMachine,
  wifi: Wifi,
};

interface StayAmenitiesProps {
  amenities: StayAmenity[];
}

const StayAmenities = ({ amenities }: StayAmenitiesProps) => (
  <section aria-labelledby="amenities-heading">
    <h2
      id="amenities-heading"
      className="font-heading text-xl font-semibold text-foreground"
    >
      Amenities
    </h2>
    <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {amenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];

        return (
          <li key={amenity}>
            <Badge variant="outline" size="lg" className="w-full justify-start gap-2">
              <Icon className="size-4" />
              {humanizeLabel(amenity)}
            </Badge>
          </li>
        );
      })}
    </ul>
  </section>
);

export { StayAmenities };
