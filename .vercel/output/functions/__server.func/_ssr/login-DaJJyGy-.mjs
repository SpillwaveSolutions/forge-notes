import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Navigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as signIn, t as authClient } from "./client-Bm2YFrbd.mjs";
import { t as GROK_PROVIDERS } from "./server-A0BVD3fT.mjs";
import { i as useCurrentUserState, n as Input, t as Button } from "./input-CLjwzknR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DaJJyGy-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** True on loopback / desktop-local origins where the Grok preview OAuth client rejects callbacks. */
function isLocalAuthOrigin() {
	if (typeof window === "undefined") return false;
	const host = window.location.hostname;
	return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [localOrigin, setLocalOrigin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setLocalOrigin(isLocalAuthOrigin()), []);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onEmailSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "signup") {
				const { error: err } = await authClient.signUp.email({
					email: email.trim(),
					password,
					name: name.trim() || email.trim().split("@")[0] || "User"
				});
				if (err) throw new Error(err.message ?? "Sign-up failed");
			} else {
				const { error: err } = await authClient.signIn.email({
					email: email.trim(),
					password
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
	async function onSocial(providerId) {
		setError(null);
		setBusy(true);
		try {
			await signIn(providerId, { callbackURL: "/" });
		} catch (err) {
			const raw = err instanceof Error ? err.message : "Sign-in failed";
			if (/invalid redirect/i.test(raw) || localOrigin) setError("Google / X sign-in needs a public app URL registered with the Grok auth broker. On this machine use email & password, or open the app in a Grok live preview / deployed host.");
			else setError(raw);
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-6 text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex size-12 items-center justify-center rounded-xl bg-foreground text-lg font-semibold text-background",
							children: "F"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: "Sign in to ForgeNotes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Signed-in pages sync to the database. Guests keep a local copy only."
						})
					]
				}),
				localOrigin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-xs leading-relaxed text-amber-950 dark:text-amber-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-medium",
							children: "Desktop / local note:"
						}),
						" Continue with Google or X uses the shared Grok auth broker, which only accepts callbacks from",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-black/5 px-1 dark:bg-white/10",
							children: "*.grok-sandbox.com"
						}),
						" ",
						"(or a deployed app with its own broker credentials). For this Tauri / localhost window, use ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "email & password" }),
						" below."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: onEmailSubmit,
							className: "space-y-3",
							children: [
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "name",
										className: "text-xs font-medium text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										autoComplete: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Your name",
										disabled: busy
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "email",
										className: "text-xs font-medium text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										autoComplete: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "you@example.com",
										disabled: busy
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "password",
										className: "text-xs font-medium text-muted-foreground",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										autoComplete: mode === "signup" ? "new-password" : "current-password",
										required: true,
										minLength: 8,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "At least 8 characters",
										disabled: busy
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full",
									disabled: busy,
									children: busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in with email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline",
									disabled: busy,
									onClick: () => {
										setMode((m) => m === "signin" ? "signup" : "signin");
										setError(null);
									},
									children: mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-full border-t border-border" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative flex justify-center text-xs uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-background px-2 text-muted-foreground",
									children: "or"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "h-11 w-full justify-center",
								disabled: busy,
								onClick: () => void onSocial(p.providerId),
								children: ["Continue with ", p.label]
							}, p.providerId))
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "underline-offset-4 hover:underline",
						children: "Continue as guest"
					})
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
