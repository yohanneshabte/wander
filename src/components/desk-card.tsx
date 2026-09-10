import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ADDRESS_FULL, PHONE } from "@/lib/spa/rooms";

export function DeskCard({ url }: { url: string }) {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(url, {
      width: 512,
      margin: 1,
      color: { dark: "#3F2A1D", light: "#00000000" },
      errorCorrectionLevel: "M",
    }).then((data) => {
      if (alive) setSrc(data);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  return (
    <article className="desk-card flex flex-col rounded-[28px] bg-surface px-6 py-7 text-center shadow-[var(--shadow-border)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        Palo Alto · since 1980
      </p>
      <h1 className="mt-2 font-display text-[1.85rem] leading-tight text-wood">
        Watercourse Way
      </h1>
      <p className="mt-2 font-display text-base leading-snug text-wood">
        A Journey for the Spirit, a respite for the body
      </p>
      <p className="mt-3 text-sm leading-relaxed text-fg">
        Book the room on your phone instead of waiting 30 minutes at the desk.
      </p>
      <div className="mx-auto mt-5 size-44 rounded-2xl bg-bg p-2">
        {src ? (
          <img
            src={src}
            alt="Scan to open the Book Now demo"
            className="size-full"
          />
        ) : (
          <div className="size-full rounded-xl bg-surface-2" />
        )}
      </div>
      <p className="mt-3 break-all text-[11px] text-muted">{url}</p>
      <p className="mt-4 text-sm font-medium text-wood">
        Open in Safari · no account · no payment
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Demo only — real Private Hot Tub Rooms are still booked by calling{" "}
        {PHONE}. {ADDRESS_FULL}.
      </p>
    </article>
  );
}
