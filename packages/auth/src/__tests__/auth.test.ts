import { describe, expect, it, vi } from "vitest";

vi.mock("@airbnb-clone/db", () => ({
  db: {
    query: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
  },
}));

vi.mock("@airbnb-clone/env/server", () => ({
  env: {
    BETTER_AUTH_SECRET: "test-secret",
    BETTER_AUTH_URL: "http://localhost:3000",
    NODE_ENV: "test",
  },
}));

describe("auth configuration", () => {
  it("exports auth object", async () => {
    const { auth } = await import("../index");

    expect(auth).toBeDefined();
    expect(auth).toHaveProperty("handler");
    expect(auth).toHaveProperty("api");
  });

  it("auth api has expected methods", async () => {
    const { auth } = await import("../index");

    expect(auth.api).toBeDefined();
    expect(typeof auth.api.getSession).toBe("function");
  });
});
