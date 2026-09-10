import {
  Bath,
  Dumbbell,
  Flame,
  FlaskConical,
  HeartPulse,
  Moon,
  Snowflake,
  Sparkles,
  Swords,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VISUAL_TAGS, type TagKey } from "@/lib/market/tags";

const ICONS: Record<TagKey, LucideIcon> = {
  gym: Dumbbell,
  sauna: Flame,
  soak: Bath,
  float: Waves,
  recovery: Snowflake,
  sleep: Moon,
  pain: HeartPulse,
  focus: FlaskConical,
  martial: Swords,
  skin: Sparkles,
};

export function TagIcon({ tag, className }: { tag: TagKey; className?: string }) {
  const Icon = ICONS[tag] ?? Sparkles;
  return <Icon className={cn("size-4", className)} strokeWidth={1.75} />;
}

export function TagChip({
  tag,
  on,
  onClick,
  count,
}: {
  tag: TagKey;
  on?: boolean;
  onClick?: () => void;
  count?: number;
}) {
  const meta = VISUAL_TAGS.find((t) => t.key === tag);
  if (!meta) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm",
        on ? "bg-wood text-wood-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]",
      )}
    >
      <span
        className={cn(
          "grid size-7 place-items-center rounded-full",
          on ? "bg-wood-fg/15" : "bg-sage-soft text-sage",
        )}
      >
        <TagIcon tag={tag} />
      </span>
      {meta.label}
      {typeof count === "number" ? (
        <span className="text-[11px] tabular-nums opacity-70">{count}</span>
      ) : null}
    </button>
  );
}
