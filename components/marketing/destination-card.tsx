import Image from "next/image";

import { formatCompactCount } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  name: string;
  country: string;
  count: number;
  image: string;
  className?: string;
  onClick?: () => void;
}

const DestinationCard = ({
  name,
  country,
  count,
  image,
  className,
  onClick,
}: DestinationCardProps) => {
  const content = (
    <>
      <Image
        src={image}
        alt={`${name}, ${country}`}
        fill
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-[rgba(13,47,59,0.72)] via-[rgba(13,47,59,0.15)] to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-200 group-hover:-translate-y-0.5">
        <p className="font-serif text-xl leading-tight tracking-[-0.02em] text-white">
          {name}
        </p>
        <p className="mt-1 text-sm text-white/75">{country}</p>
        <p className="mt-2 text-xs font-medium text-white/60">
          {formatCompactCount(count)} stays
        </p>
      </div>
    </>
  );

  const sharedClassName = cn(
    "group relative aspect-3/4 overflow-hidden rounded-lg bg-muted shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lg",
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(sharedClassName, "cursor-pointer")}
      >
        {content}
      </button>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
};

export { DestinationCard };
