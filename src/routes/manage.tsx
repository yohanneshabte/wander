import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { RoleGate } from "@/components/role-gate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addMedia, myStore, saveListing } from "@/lib/market/api";
import { formatRange, formatDateLabel } from "@/lib/spa/engine";
import { toast } from "sonner";

export const Route = createFileRoute("/manage")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: ManagePage,
});

function ManagePage() {
  return (
    <Shell>
      <RoleGate allow={["store", "admin"]}>
        <ManageDesk />
      </RoleGate>
    </Shell>
  );
}

function ManageDesk() {
  const [data, setData] = useState<Awaited<ReturnType<typeof myStore>> | null>(null);
  const [pitch, setPitch] = useState("");
  const [rules, setRules] = useState("");
  const [cancel, setCancel] = useState("");
  const [tour, setTour] = useState("");
  const [cover, setCover] = useState("");
  const [phone, setPhone] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [busy, setBusy] = useState(false);

  function hydrate() {
    myStore()
      .then((row) => {
        setData(row);
        if (row.listing) {
          setPitch(row.listing.pitch);
          setRules(row.listing.houseRules);
          setCancel(row.listing.cancelNote);
          setTour(row.listing.tour3dUrl);
          setCover(row.listing.coverUrl);
          setPhone(row.listing.phone);
        }
      })
      .catch((err) => toast(err instanceof Error ? err.message : "Store locked"));
  }

  useEffect(() => {
    hydrate();
  }, []);

  if (!data?.listing) {
    return (
      <div className="px-5 pt-10">
        <p className="text-sm text-muted">No store on this account.</p>
      </div>
    );
  }

  const listing = data.listing;

  async function save() {
    setBusy(true);
    try {
      await saveListing({
        data: {
          id: listing.id,
          pitch,
          houseRules: rules,
          cancelNote: cancel,
          tour3dUrl: tour,
          coverUrl: cover,
          phone,
          guestsMax: listing.guestsMax,
        },
      });
      toast("Listing saved — only your store.");
      hydrate();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function media() {
    if (!mediaUrl.trim()) return;
    setBusy(true);
    try {
      await addMedia({
        data: {
          listingId: listing.id,
          url: mediaUrl.trim(),
          kind: mediaUrl.includes("matterport") || mediaUrl.includes("kuula") ? "tour3d" : "photo",
          caption: "Store upload",
        },
      });
      setMediaUrl("");
      toast("Media attached.");
      hydrate();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Link rejected");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-5 pt-6 pb-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Store portal · partitioned
      </p>
      <h1 className="font-display text-3xl text-wood">{listing.name}</h1>
      <p className="mt-2 text-sm text-muted">
        You only see holds for this house. Other stores are sealed off.
      </p>

      <label className="mt-5 block text-sm">
        Pitch
        <Textarea className="mt-1" value={pitch} onChange={(e) => setPitch(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm">
        House rules
        <Textarea className="mt-1" value={rules} onChange={(e) => setRules(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm">
        Cancel note
        <input
          className="mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
          value={cancel}
          onChange={(e) => setCancel(e.target.value)}
        />
      </label>
      <label className="mt-3 block text-sm">
        3D tour URL (Matterport, Kuula)
        <input
          className="mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
          value={tour}
          onChange={(e) => setTour(e.target.value)}
          placeholder="https://my.matterport.com/show/?m=…"
        />
      </label>
      <label className="mt-3 block text-sm">
        Cover image URL
        <input
          className="mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
      </label>
      <label className="mt-3 block text-sm">
        Phone
        <input
          className="mt-1 min-h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <Button className="mt-4 w-full" onClick={() => void save()} disabled={busy}>
        Save listing
      </Button>

      <h2 className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">
        Add photo or 3D link
      </h2>
      <div className="mt-2 flex gap-2">
        <input
          className="min-h-12 flex-1 rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="https://…"
        />
        <Button className="h-12" onClick={() => void media()} disabled={busy}>
          Add
        </Button>
      </div>
      {data.media.length ? (
        <ul className="mt-3 flex flex-col gap-2">
          {data.media.map((m) => (
            <li key={m.id} className="truncate text-xs text-muted">
              {m.kind} · {m.url}
            </li>
          ))}
        </ul>
      ) : null}

      <h2 className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">
        Holds on this floor only
      </h2>
      <ul className="mt-2 flex flex-col gap-2">
        {data.holds.length === 0 ? (
          <li className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted">
            No holds yet.
          </li>
        ) : (
          data.holds.map((h) => (
            <li
              key={h.id}
              className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <p className="text-sm font-medium">{h.guest_name || "Guest"}</p>
              <p className="text-xs text-muted">
                {formatDateLabel(h.date)} · {formatRange(h.start_min, h.duration_min)}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
