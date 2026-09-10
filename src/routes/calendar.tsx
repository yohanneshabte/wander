import { createFileRoute } from "@tanstack/react-router";
import { StaffCalendar } from "@/components/staff-calendar";
import { RoleGate } from "@/components/role-gate";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

function CalendarPage() {
  return (
    <Shell>
      <RoleGate allow={["staff", "admin"]}>
        <StaffCalendar />
      </RoleGate>
    </Shell>
  );
}
