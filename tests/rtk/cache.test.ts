import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the redis module
vi.mock("@/lib/cache/redis", () => ({
  hasRedis: vi.fn(() => true),
  redisGet: vi.fn(),
  redisSet: vi.fn(() => Promise.resolve(true)),
  redisDel: vi.fn(() => Promise.resolve(true)),
  redisDelPattern: vi.fn(() => Promise.resolve(1)),
}));

import { RTK_KEYS, rtkCached, invalidateRTK } from "@/lib/rtk/cache";
import { hasRedis, redisGet, redisSet, redisDel, redisDelPattern } from "@/lib/cache/redis";

describe("RTK cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("RTK_KEYS", () => {
    it("generates search:lib key with query + limit", () => {
      expect(RTK_KEYS.searchLib("freud", 5)).toBe("rtk:search:lib:freud:5");
    });

    it("generates lib key by slug", () => {
      expect(RTK_KEYS.lib("ego")).toBe("rtk:lib:ego");
    });

    it("generates chunk key by id", () => {
      expect(RTK_KEYS.chunk("abc-123")).toBe("rtk:chunk:abc-123");
    });
  });

  describe("rtkCached", () => {
    it("returns cached value on HIT", async () => {
      (redisGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ cached: true });
      const fetchFresh = vi.fn();

      const result = await rtkCached("rtk:lib:ego", fetchFresh, 300);

      expect(result).toEqual({ cached: true });
      expect(fetchFresh).not.toHaveBeenCalled();
    });

    it("queries fresh and writes cache on MISS", async () => {
      (redisGet as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
      const fetchFresh = vi.fn().mockResolvedValue({ fresh: true });

      const result = await rtkCached("rtk:lib:ego", fetchFresh, 300);

      expect(result).toEqual({ fresh: true });
      expect(fetchFresh).toHaveBeenCalled();
      expect(redisSet).toHaveBeenCalledWith("rtk:lib:ego", { fresh: true }, 300);
    });

    it("falls back to fresh when Redis unavailable", async () => {
      (hasRedis as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);
      const fetchFresh = vi.fn().mockResolvedValue({ noRedis: true });

      const result = await rtkCached("rtk:lib:ego", fetchFresh, 300);

      expect(result).toEqual({ noRedis: true });
      expect(redisGet).not.toHaveBeenCalled();
    });
  });

  describe("invalidateRTK", () => {
    it("deletes lib + related keys and pattern-deletes search + recent", async () => {
      await invalidateRTK("ego");

      expect(redisDel).toHaveBeenCalledWith("rtk:lib:ego");
      expect(redisDelPattern).toHaveBeenCalledWith("rtk:search:*");
      expect(redisDelPattern).toHaveBeenCalledWith("rtk:recent:*");
      expect(redisDelPattern).toHaveBeenCalledWith("rtk:related:ego:*");
    });

    it("pattern-deletes everything on full invalidate", async () => {
      await invalidateRTK();

      expect(redisDelPattern).toHaveBeenCalledWith("rtk:*");
    });
  });
});
