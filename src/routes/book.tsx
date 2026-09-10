import { createFileRoute } from "@tanstack/react-router";
import { BookFlow } from "@/components/book-flow";
import { SignInRequired } from "@/components/role-gate";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/book")({ component: BookPage });

function BookPage() {
  return (
    <Shell>
      <SignInRequired>
        <BookFlow />
      </SignInRequired>
    </Shell>
  );
}
