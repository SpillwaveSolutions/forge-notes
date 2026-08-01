import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

/** True on loopback / desktop-local origins where the Grok preview OAuth client rejects callbacks. */
function isLocalAuthOrigin(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Computed after mount, not during render. isLocalAuthOrigin() reads
  // window.location, so it is false during SSR and true on the client — using
  // it directly made the server and first client render disagree, which React
  // reports as a hydration mismatch and recovers from by re-rendering.
  const [localOrigin, setLocalOrigin] = useState(false);
  useEffect(() => setLocalOrigin(isLocalAuthOrigin()), []);

  if (!isPending && user) {
    return <Navigate to="/" />;
  }

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.trim().split("@")[0] || "User",
        });
        if (err) throw new Error(err.message ?? "Sign-up failed");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (err) throw new Error(err.message ?? "Sign-in failed");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSocial(providerId: string) {
    setError(null);
    setBusy(true);
    try {
      await signIn(providerId, { callbackURL: "/" });
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Sign-in failed";
      if (/invalid redirect/i.test(raw) || localOrigin) {
        setError(
          "Google / X sign-in needs a public app URL registered with the Grok auth broker. On this machine use email & password, or open the app in a Grok live preview / deployed host.",
        );
      } else {
        setError(raw);
      }
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-foreground text-lg font-semibold text-background">
            F
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to ForgeNotes</h1>
          <p className="text-sm text-muted-foreground">
            Signed-in pages sync to the database. Guests keep a local copy only.
          </p>
        </div>

        {localOrigin && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-xs leading-relaxed text-amber-950 dark:text-amber-100">
            <strong className="font-medium">Desktop / local note:</strong> Continue with Google or
            X uses the shared Grok auth broker, which only accepts callbacks from{" "}
            <code className="rounded bg-black/5 px-1 dark:bg-white/10">*.grok-sandbox.com</code>{" "}
            (or a deployed app with its own broker credentials). For this Tauri / localhost window,
            use <strong>email &amp; password</strong> below.
          </p>
        )}

        {authEnabled ? (
          <div className="space-y-4">
            <form onSubmit={onEmailSubmit} className="space-y-3">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={busy}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={busy}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  disabled={busy}
                />
              </div>
              <Button type="submit" className="h-11 w-full" disabled={busy}>
                {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in with email"}
              </Button>
              <button
                type="button"
                className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                disabled={busy}
                onClick={() => {
                  setMode((m) => (m === "signin" ? "signup" : "signin"));
                  setError(null);
                }}
              >
                {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-center"
                  disabled={busy}
                  onClick={() => void onSocial(p.providerId)}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-border bg-muted/40 p-3 text-center text-sm text-muted-foreground">
            Sign-in is disabled in this environment. Data still uses the local database fallback.
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
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
