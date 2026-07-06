import Link from "next/link";
import { MapPinOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const StayNotFound = () => (
  <Empty className="py-20">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <MapPinOff />
      </EmptyMedia>
      <EmptyTitle>Stay not found</EmptyTitle>
      <EmptyDescription>
        This stay may have been removed or the link is incorrect.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button render={<Link href="/" />}>Browse stays</Button>
    </EmptyContent>
  </Empty>
);

export { StayNotFound };
