import { useNavigate } from "@tanstack/react-router";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { RoomTour } from "@/components/room-tour";
import { TagChip } from "@/components/tag-chip";
import { requestHold } from "@/lib/market/api";
import { placeById } from "@/lib/market/search";
import { KIND_MENU } from "@/lib/directory/prospects";
import { VISUAL_TAGS } from "@/lib/market/tags";
import { setHousePick } from "@/lib/platform/store";
import { KIND_LABEL, GAP_LABEL, REGION_LABEL } from "@/lib/directory/prospects";
import { formatMoney } from "@/lib/utils";
import { todayISO } from "@/lib/spa/engine";
import { toast } from "sonner";
import { refreshSpa, useProfile } from "@/lib/spa/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { noteWeekHit } from "@/lib/market/goals-local";
import { placeMatchesTag } from "@/lib/market/tags";

export const Route = createFileRoute("/explore/$id")({
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const { role } = useProfile();
  const listing = placeById(id);

  if (!listing) {
    return (
      <Shell>
        <div className="px-5 pt-10">
          <p className="text-sm text-muted">Not in the 100-mile catalog.</p>
          <Link to="/search" className="mt-4 block">
            <Button className="w-full">Search</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  const menu = KIND_MENU[listing.kind];
  const live = listing.id === "watercourse-ref" || listing.id === "solivana-ref";
  const listingId = listing.id;
  const tags = VISUAL_TAGS.filter((t) => placeMatchesTag(listing, t.key));

  async function hold(serviceName: string) {
    if (!user) {
      await navigate({ to: "/login", search: { next: `/explore/${id}` } });
      return;
    }
    try {
      if (live) {
        setHousePick(listingId === "solivana-ref" ? "solivana" : "watercourse");
        await navigate({ to: "/book" });
        return;
      }
      const saved = await requestHold({
        data: { listingId, serviceName, date: todayISO() },
      });
      for (const t of tags) noteWeekHit(t.key, todayISO());
      refreshSpa();
      toast(`Hold at ${saved.house}.`);
      await navigate({ to: "/account" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not hold");
    }
  }

  return (
    <Shell>
      <div className="px-5 pt-6 pb-8">
        <img
          src={listing.coverUrl}
          alt=""
          className="h-52 w-full rounded-[28px] object-cover outline outline-1 -outline-offset-1 outline-black/10"
        />
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
          {REGION_LABEL[listing.region]} · {KIND_LABEL[listing.kind]}
        </p>
        <h1 className="font-display text-3xl leading-tight text-wood text-balance">
          {listing.name}
        </h1>
        <p className="mt-1 text-sm text-muted">{listing.address}</p>
        <p className="mt-3 font-display text-2xl tabular-nums text-wood">
          from {formatMoney(listing.fromPrice)}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-pretty">{listing.pitch}</p>
        <p className="mt-2 text-xs text-muted">{GAP_LABEL[listing.bookingGap]}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <TagChip
              key={t.key}
              tag={t.key}
              onClick={() => navigate({ to: "/search", search: { tag: t.key } })}
            />
          ))}
        </div>

        <div className="mt-4">
          <RoomTour url={listing.tour3dUrl} title={listing.name} />
        </div>

        <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
          Menu
        </h2>
        <ul className="mt-2 flex flex-col gap-2">
          {menu.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted">
                  {s.durationMin ? `${s.durationMin} min · ` : ""}
                  {s.blurb}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm tabular-nums">{formatMoney(s.listPrice)}</p>
                <Button size="sm" className="mt-1" onClick={() => void hold(s.name)}>
                  {user ? "Hold" : "Sign in to hold"}
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl bg-surface px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-border)]">
          <p className="font-medium">House rules</p>
          <p className="mt-1 text-muted">{listing.houseRules}</p>
          <p className="mt-2 text-xs text-muted">{listing.cancelNote}</p>
        </div>

        <Link to="/search" className="mt-6 block">
          <Button variant="outline" className="w-full">
            Back to Search
          </Button>
        </Link>
        {role === "admin" ? (
          <p className="mt-3 text-xs text-muted">Owner: this listing is modeled, not affiliated.</p>
        ) : null}
      </div>
    </Shell>
  );
}
