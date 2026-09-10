import "../_runtime.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatMoney(n) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: n % 1 === 0 ? 0 : 2
	}).format(n);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-[transform,background-color,opacity] duration-150 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg", {
	variants: {
		variant: {
			primary: "bg-wood text-wood-fg shadow-[var(--shadow-border)] hover:bg-wood/90",
			sage: "bg-sage text-primary-fg hover:bg-sage/90",
			outline: "bg-surface text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			cream: "bg-surface-2 text-fg hover:bg-border"
		},
		size: {
			md: "h-12 px-5",
			lg: "h-14 px-6 text-lg",
			xl: "h-16 px-6 text-lg",
			icon: "size-12",
			sm: "h-10 px-3 text-sm"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
export { cn as n, formatMoney as r, Button as t };
