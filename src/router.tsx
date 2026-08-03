import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { reportCaughtError } from "./lib/report-client-errors";

export function getRouter() {
  // `defaultOnCatch` is the only place a route-boundary error is visible. The
  // boundary consumes the exception, so `window.onerror` never sees it — on
  // desktop that presents as a bare "Something went wrong!" with no console
  // and no way to read what actually failed.
  return createRouter({ routeTree, defaultOnCatch: reportCaughtError });
}
