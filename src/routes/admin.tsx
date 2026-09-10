import { createFileRoute } from "@tanstack/react-router";
import { AdminDesk } from "@/components/admin-desk";
import { RoleGate } from "@/components/role-gate";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <Shell wide>
      <RoleGate allow={["admin"]}>
        <AdminDesk />
      </RoleGate>
    </Shell>
  );
}
