import { describe, expect, it } from "vitest";
import { call } from "@orpc/server";
import { appRouter } from "../routers";
import { mockContextWithSession, mockContextWithoutSession } from "../test/setup";

describe("appRouter", () => {
  describe("healthCheck", () => {
    it("returns OK", async () => {
      const result = await call(appRouter.healthCheck, undefined, {
        context: mockContextWithoutSession,
      });

      expect(result).toBe("OK");
    });
  });

  describe("privateData", () => {
    it("returns private data when authenticated", async () => {
      const result = await call(appRouter.privateData, undefined, {
        context: mockContextWithSession,
      });

      expect(result.message).toBe("This is private");
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe("test@example.com");
    });

    it("throws UNAUTHORIZED when not authenticated", async () => {
      await expect(
        call(appRouter.privateData, undefined, {
          context: mockContextWithoutSession,
        })
      ).rejects.toThrow();
    });
  });
});
