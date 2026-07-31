import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Navigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();

  if (!isPending && user) {
    return <Navigate to="/" />;
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-foreground text-lg font-semibold text-background">
            W
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Your pages save to the cloud database when you're signed in. Guests keep a local
            copy in this browser only.
          </p>
        </div>

        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="h-11 w-full justify-center"
                onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-border bg-muted/40 p-3 text-center text-sm text-muted-foreground">
            Sign-in is disabled in this environment. Data still uses the local database fallback.
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="underline-offset-4 hover:underline">
            Continue as guest
          </Link>
        </p>
      </div>
    </main>
  );
}
