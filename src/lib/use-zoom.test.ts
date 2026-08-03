import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_ZOOM, ZOOM_STEPS, nearestStep, readZoom, stepZoom } from "./use-zoom";

afterEach(() => {
  window.localStorage.clear();
});

describe("stepZoom", () => {
  it("steps up and down the ladder", () => {
    expect(stepZoom(1, 1)).toBe(1.15);
    expect(stepZoom(1, -1)).toBe(0.85);
  });

  it("clamps at both ends instead of running off", () => {
    expect(stepZoom(ZOOM_STEPS[0]!, -1)).toBe(ZOOM_STEPS[0]);
    expect(stepZoom(ZOOM_STEPS.at(-1)!, 1)).toBe(ZOOM_STEPS.at(-1));
  });

  it("resets to 1 on direction 0", () => {
    expect(stepZoom(1.75, 0)).toBe(DEFAULT_ZOOM);
  });

  it("snaps an off-ladder value to its neighbour before stepping", () => {
    // The case repeated multiplication would produce, or a hand-edited key.
    // Without the snap this would have no defined next step at all.
    expect(nearestStep(1.31)).toBe(nearestStep(1.3));
    expect(stepZoom(1.31, 1)).toBe(1.5);
  });

  it("never drifts: stepping up then down returns the original", () => {
    let z = 1;
    for (let i = 0; i < 3; i++) z = stepZoom(z, 1);
    for (let i = 0; i < 3; i++) z = stepZoom(z, -1);
    expect(z).toBe(1);
  });
});

describe("readZoom", () => {
  it("defaults when nothing is stored", () => {
    expect(readZoom()).toBe(DEFAULT_ZOOM);
  });

  it("reads a stored value", () => {
    window.localStorage.setItem("forgenotes-zoom", "1.5");
    expect(readZoom()).toBe(1.5);
  });

  it.each(["", "abc", "0", "-2", "NaN"])(
    "falls back to the default for junk (%s) rather than making the app unreadable",
    (junk) => {
      window.localStorage.setItem("forgenotes-zoom", junk);
      expect(readZoom()).toBe(DEFAULT_ZOOM);
    },
  );

  it("clamps a stored value outside the ladder", () => {
    window.localStorage.setItem("forgenotes-zoom", "99");
    expect(readZoom()).toBe(ZOOM_STEPS.at(-1));
  });
});
