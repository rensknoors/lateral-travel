import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Stay } from "@/features/stays/types/stay";

interface StayPoliciesProps {
  checkInTime: Stay["checkInTime"];
  checkOutTime: Stay["checkOutTime"];
  policies: Stay["policies"];
}

const StayPolicies = ({
  checkInTime,
  checkOutTime,
  policies,
}: StayPoliciesProps) => (
  <section aria-labelledby="policies-heading">
    <h2
      id="policies-heading"
      className="font-heading text-xl font-semibold text-foreground"
    >
      Policies
    </h2>
    <Accordion defaultValue={["checkin"]} className="mt-4">
      <AccordionItem value="checkin">
        <AccordionTrigger>Check-in &amp; check-out</AccordionTrigger>
        <AccordionContent>
          <dl className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-foreground">Check-in</dt>
              <dd>{checkInTime}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-foreground">Check-out</dt>
              <dd>{checkOutTime}</dd>
            </div>
          </dl>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rules">
        <AccordionTrigger>House rules</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {policies.map((policy) => (
              <li key={policy}>{policy}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
);

export { StayPolicies };
