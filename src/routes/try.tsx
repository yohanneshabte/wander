import { createFileRoute, Link } from "@tanstack/react-router";
import { DeskCard } from "@/components/desk-card";
import { Button } from "@/components/ui/button";
import { DEMO_URL, PHONE, PHONE_TEL } from "@/lib/spa/rooms";

export const Route = createFileRoute("/try")({ component: TryPage });

function TryPage() {
  function printCard() {
    window.print();
  }

  async function shareCard() {
    const payload = {
      title: "Watercourse Way · Book Now demo",
      text: "Try booking a private hot tub room on your phone. Demo only.",
      url: DEMO_URL,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(DEMO_URL);
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-bg px-5 pb-10 pt-6 print:max-w-none print:bg-white print:px-0 print:pt-0">
      <div className="print-hide">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          Desk card
        </p>
        <h1 className="font-display text-3xl leading-tight text-wood">
          Hand this to the desk
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No login. They scan, tap Book Now, and try a room. Print two on a
          letter page at FedEx and leave one at <CLIENT_ADDRESS>.
        </p>
      </div>

      <div className="mt-5 print:mt-0 print:grid print:grid-cols-2 print:gap-6">
        <DeskCard url={DEMO_URL} />
        <div className="mt-5 hidden print:block">
          <DeskCard url={DEMO_URL} />
        </div>
      </div>

      <div className="print-hide mt-5 flex flex-col gap-2">
        <Button size="xl" className="w-full" onClick={printCard}>
          Print desk cards
        </Button>
        <Button variant="outline" size="lg" className="w-full" onClick={shareCard}>
          Share or copy the link
        </Button>
        <Link to="/book" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Try Book Now now
          </Button>
        </Link>
        <Link to="/" className="block">
          <Button variant="ghost" className="w-full">
            Home
          </Button>
        </Link>
        <a href={PHONE_TEL} className="pt-2 text-center text-sm text-muted">
          Real tubs: Call Now · {PHONE}
        </a>
      </div>
    </div>
  );
}