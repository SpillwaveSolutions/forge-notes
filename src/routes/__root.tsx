import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { useTheme } from "@/lib/use-theme";
import { useZoom } from "@/lib/use-zoom";
import { useCaptureMode } from "@/lib/use-capture-mode";
import { reportClientErrors } from "@/lib/report-client-errors";
import appCss from "../styles.css?url";

// At module scope, not in an effect: an exception thrown during the first
// render happens before any effect runs, and that is exactly the failure this
// exists to report.
reportClientErrors();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "ForgeNotes — notes, AI & harness",
      },
      {
        name: "description",
        content:
          "ForgeNotes is a Notion-style workspace for notes, AI (Deep Agents & coding CLIs), markdown, and agent workflows.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootDocument,
});

function RootDocument() {
  // At the root so EVERY route gets them, including /login.
  useTheme();
  useZoom();
  // Dev-only; no-ops in production builds.
  useCaptureMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
