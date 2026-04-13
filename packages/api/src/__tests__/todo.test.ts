import { describe, expect, it } from "vitest";
import { call } from "@orpc/server";
import { appRouter } from "../routers";
import { mockDb, mockContextWithSession } from "../test/setup";

describe("todoRouter", () => {
  describe("getAll", () => {
    it("returns empty array when no todos", async () => {
      const result = await call(appRouter.todo.getAll, undefined, {
        context: mockContextWithSession,
      });

      expect(result).toEqual([]);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("returns todos from database", async () => {
      const mockTodos = [
        { id: 1, text: "Test todo 1", completed: false },
        { id: 2, text: "Test todo 2", completed: true },
      ];
      mockDb.from.mockResolvedValueOnce(mockTodos);

      const result = await call(appRouter.todo.getAll, undefined, {
        context: mockContextWithSession,
      });

      expect(result).toEqual(mockTodos);
    });
  });

  describe("create", () => {
    it("creates a new todo with valid input", async () => {
      const input = { text: "New todo item" };

      await call(appRouter.todo.create, input, {
        context: mockContextWithSession,
      });

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({ text: input.text });
    });

    it("throws error for empty text", async () => {
      const input = { text: "" };

      await expect(
        call(appRouter.todo.create, input, {
          context: mockContextWithSession,
        })
      ).rejects.toThrow();
    });

    it("throws error for whitespace-only text", async () => {
      const input = { text: "   " };

      await expect(
        call(appRouter.todo.create, input, {
          context: mockContextWithSession,
        })
      ).rejects.toThrow();
    });
  });

  describe("toggle", () => {
    it("toggles todo completion status", async () => {
      const input = { id: 1, completed: true };

      await call(appRouter.todo.toggle, input, {
        context: mockContextWithSession,
      });

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({ completed: true });
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("accepts valid todo id", async () => {
      const input = { id: 123, completed: false };

      await call(appRouter.todo.toggle, input, {
        context: mockContextWithSession,
      });

      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deletes todo by id", async () => {
      const input = { id: 1 };

      await call(appRouter.todo.delete, input, {
        context: mockContextWithSession,
      });

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });
  });
});
