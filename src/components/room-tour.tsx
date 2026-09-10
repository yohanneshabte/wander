export function RoomTour({ url, title }: { url: string; title: string }) {
  if (!url) {
    return (
      <div className="relative overflow-hidden rounded-[28px] bg-wood px-5 py-10 text-wood-fg">
        <p className="text-xs font-medium uppercase tracking-wide opacity-70">
          3D room
        </p>
        <p className="mt-2 font-display text-2xl leading-tight">{title}</p>
        <p className="mt-2 text-sm leading-relaxed opacity-80">
          Store can paste a Matterport or Kuula link. Until then, this is the
          hold — not a fake walkthrough.
        </p>
      </div>
    );
  }
  const safe = /^https:\/\//i.test(url);
  if (!safe) {
    return (
      <a href={url} className="block rounded-2xl bg-surface px-4 py-3 text-sm">
        Open 3D view
      </a>
    );
  }
  return (
    <div className="overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]">
      <iframe
        title={`3D tour of ${title}`}
        src={url}
        className="h-56 w-full"
        allow="xr-spatial-tracking; fullscreen; web-share"
        loading="lazy"
      />
    </div>
  );
}
