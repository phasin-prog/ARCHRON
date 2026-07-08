import { describe, it, expect } from "vitest";
import { SEALS, getSealById, getSealsByLevel, getSealsByCategory } from "@/lib/content/seals";

describe("seal data", () => {
  it("has exactly 15 seals", () => {
    expect(SEALS).toHaveLength(15);
  });

  it("all seals have unique ids", () => {
    const ids = SEALS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all seals have unique slugs", () => {
    const slugs = SEALS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getSealById returns the correct seal", () => {
    const seal = getSealById("the-seeker");
    expect(seal).toBeDefined();
    expect(seal?.name).toBe("The Seeker");
  });

  it("getSealById returns undefined for unknown id", () => {
    expect(getSealById("nonexistent")).toBeUndefined();
  });

  it("getSealsByLevel returns seals for that level", () => {
    const level1 = getSealsByLevel(1);
    expect(level1).toHaveLength(1);
    expect(level1[0].id).toBe("the-seeker");
  });

  it("getSealsByCategory returns seals for that category", () => {
    const support = getSealsByCategory("support");
    expect(support).toHaveLength(2);
    expect(support.map((s) => s.id).sort()).toEqual(["the-companion", "the-patron"]);
  });

  it("all seals have valid shape", () => {
    const validShapes = ["circle", "octagon", "hexagon", "diamond", "compass"];
    SEALS.forEach((s) => {
      expect(validShapes).toContain(s.shape);
    });
  });

  it("all seals have valid color hex", () => {
    SEALS.forEach((s) => {
      expect(s.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
