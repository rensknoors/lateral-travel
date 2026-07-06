"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentContainer } from "@/components/layout/content-container";
import {
  STAY_CATEGORIES,
  type StayCategory,
} from "@/features/stays/types/stay";
import { humanizeLabel } from "@/lib/format";

interface CategoryTabsProps {
  activeCategory?: StayCategory;
  onCategoryChange: (category: StayCategory | undefined) => void;
}

const CategoryTabs = ({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) => (
  <section className="border-b border-border bg-card">
    <ContentContainer size="xl" className="py-0">
      <Tabs
        value={activeCategory ?? "all"}
        onValueChange={(value) =>
          onCategoryChange(
            value === "all" ? undefined : (value as StayCategory),
          )
        }
      >
        <TabsList
          variant="pill"
          className="h-14 w-full flex-wrap gap-2 border-0 py-3"
        >
          <TabsTrigger value="all">All</TabsTrigger>
          {STAY_CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category}>
              {humanizeLabel(category)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </ContentContainer>
  </section>
);

export { CategoryTabs };
