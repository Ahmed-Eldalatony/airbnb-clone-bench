import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

export const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockResolvedValue([]),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue([]),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue([]),
  delete: vi.fn().mockReturnThis(),
};

vi.mock("@airbnb-clone/db", () => ({
  db: mockDb,
}));

export const mockContextWithoutSession = {
  auth: null,
  session: null,
};

export const mockContextWithSession = {
  auth: null,
  session: {
    session: {
      id: "test-session-id",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      token: "test-token",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "test-user-id",
    },
    user: {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};
