import { Laptop2, Monitor, Volume2, Wifi } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { WorkSetup } from "@/features/stays/types/stay";
import { humanizeLabel } from "@/lib/format";

interface StayWorkSetupProps {
  workSetup: WorkSetup;
}

const StayWorkSetup = ({ workSetup }: StayWorkSetupProps) => (
  <section aria-labelledby="work-setup-heading">
    <h2
      id="work-setup-heading"
      className="font-heading text-xl font-semibold text-foreground"
    >
      Remote-work fit
    </h2>
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">Work-ready details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Wifi className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Wi-Fi speed</p>
            <p className="text-sm text-muted-foreground">
              {workSetup.wifiMbps} Mbps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Laptop2 className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Desk setup</p>
            <p className="text-sm text-muted-foreground">
              {humanizeLabel(workSetup.deskType)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Monitor className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">External monitor</p>
            <p className="text-sm text-muted-foreground">
              {workSetup.hasMonitor ? "Available" : "Not provided"}
            </p>
          </div>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Volume2 className="size-4 shrink-0 text-muted-foreground" />
              <span className="font-medium text-foreground">Quiet score</span>
            </div>
            <span className="tabular-nums text-muted-foreground">
              {workSetup.quietScore}/100
            </span>
          </div>
          <Progress value={workSetup.quietScore} className="w-full" />
        </div>
      </CardContent>
    </Card>
  </section>
);

export { StayWorkSetup };
