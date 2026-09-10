import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { VisitBeacon } from "@/components/visit-beacon";
import { HouseTheme } from "@/components/house-theme";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Watercourse Way";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Book a private hot-tub room at Watercourse Way from your phone. 165 Channing Ave, Palo Alto.",
      },
      { name: "theme-color", content: "#F3EBDD" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Shippori+Mincho:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <HouseTheme />
          <VisitBeacon />
          <Outlet />
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "font-sans bg-surface text-fg border-border shadow-[var(--shadow-border)]",
          }}
        />
        <Scripts />
      </body>
    </html>
  ),
});
