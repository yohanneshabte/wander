import { createFileRoute } from "@tanstack/react-router";
import { InsightsPanel } from "@/components/insights-panel";
import { RoleGate } from "@/components/role-gate";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/insights")({ component: InsightsPage });

function InsightsPage() {
  return (
    <Shell>
      <RoleGate allow={["staff", "admin"]}>
        <InsightsPanel />
      </RoleGate>
    </Shell>
  );
}
