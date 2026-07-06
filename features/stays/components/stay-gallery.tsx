"use client";

import { Images } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StayGalleryProps {
  name: string;
  imageUrls: string[];
}

const StayGallery = ({ name, imageUrls }: StayGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const thumbnails = imageUrls.slice(1, 5);
  const hasMultiple = imageUrls.length > 1;

  return (
    <div className="relative">
      <div
        className={cn(
          "grid gap-2 overflow-hidden",
          hasMultiple ? "grid-cols-1 sm:grid-cols-4 sm:grid-rows-2" : "grid-cols-1",
        )}
      >
        <button
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setIsOpen(true);
          }}
          className={cn(
            "relative aspect-4/3 overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:aspect-auto sm:min-h-[420px]",
            hasMultiple && "sm:col-span-2 sm:row-span-2",
          )}
        >
          <Image
            src={imageUrls[0]}
            alt={name}
            fill
            preload
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </button>

        {thumbnails.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => {
              setActiveIndex(index + 1);
              setIsOpen(true);
            }}
            className="relative hidden aspect-4/3 overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:block sm:aspect-auto sm:min-h-0"
          >
            <Image
              src={url}
              alt={`${name} photo ${index + 2}`}
              fill
              sizes="(min-width: 1024px) 17vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {hasMultiple && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="absolute right-4 bottom-4 bg-card/95 backdrop-blur-sm"
              />
            }
          >
            <Images className="size-4" />
            View all photos
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-4xl">
            <DialogTitle className="sr-only">{name} photos</DialogTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {imageUrls.map((url, index) => (
                <div
                  key={url}
                  className={cn(
                    "relative aspect-4/3 overflow-hidden rounded-lg",
                    index === activeIndex && "ring-2 ring-primary",
                  )}
                >
                  <Image
                    src={url}
                    alt={`${name} photo ${index + 1}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export { StayGallery };
