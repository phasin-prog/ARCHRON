import { describe, it, expect } from "vitest";
import { estimateTokens } from "@/lib/rtk/tokens";

describe("estimateTokens", () => {
  it("returns 0 for empty string", () => {
    expect(estimateTokens("")).toBe(0);
  });

  it("estimates Thai text (~1.5 chars/token)", () => {
    // 30 Thai chars → ~20 tokens
    const thai = "จิตวิทยาคือการศึกษาจิตใจ"; // 21 chars
    const tokens = estimateTokens(thai);
    expect(tokens).toBeGreaterThan(8);
    expect(tokens).toBeLessThan(20);
  });

  it("estimates English text (~4 chars/token)", () => {
    // "psychology" = 10 chars → ~2-3 tokens
    const en = "psychology";
    const tokens = estimateTokens(en);
    expect(tokens).toBeGreaterThanOrEqual(2);
    expect(tokens).toBeLessThanOrEqual(4);
  });

  it("handles mixed Thai + English", () => {
    const mixed = "จิตวิทยา psychology คือการศึกษา";
    const tokens = estimateTokens(mixed);
    expect(tokens).toBeGreaterThan(0);
    // Should be sum of both parts, each estimated by its script
    const thaiOnly = estimateTokens("จิตวิทยา คือการศึกษา");
    const enOnly = estimateTokens("psychology");
    expect(tokens).toBeGreaterThanOrEqual(thaiOnly + enOnly - 2);
    expect(tokens).toBeLessThanOrEqual(thaiOnly + enOnly + 2);
  });

  it("is deterministic for same input", () => {
    const text = "same input twice";
    expect(estimateTokens(text)).toBe(estimateTokens(text));
  });
});
