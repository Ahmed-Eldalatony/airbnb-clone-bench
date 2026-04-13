import { describe, expect, it } from "vitest";
import { todo } from "../schema/todo";
import { user, session, account, verification } from "../schema/auth";

describe("schema", () => {
  describe("todo table", () => {
    it("has correct column definitions", () => {
      expect(todo).toBeDefined();
      expect(todo.id).toBeDefined();
      expect(todo.text).toBeDefined();
      expect(todo.completed).toBeDefined();
    });

    it("text column is required", () => {
      expect(todo.text.notNull).toBe(true);
    });

    it("completed column has default", () => {
      expect(todo.completed.hasDefault).toBe(true);
    });
  });

  describe("user table", () => {
    it("has all required columns", () => {
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.emailVerified).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it("email column is required", () => {
      expect(user.email.notNull).toBe(true);
    });
  });

  describe("session table", () => {
    it("has all required columns", () => {
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.expiresAt).toBeDefined();
      expect(session.token).toBeDefined();
      expect(session.createdAt).toBeDefined();
      expect(session.updatedAt).toBeDefined();
      expect(session.userId).toBeDefined();
    });

    it("userId column is required", () => {
      expect(session.userId.notNull).toBe(true);
    });
  });

  describe("account table", () => {
    it("has all required columns", () => {
      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.accountId).toBeDefined();
      expect(account.providerId).toBeDefined();
      expect(account.userId).toBeDefined();
      expect(account.createdAt).toBeDefined();
      expect(account.updatedAt).toBeDefined();
    });

    it("has optional OAuth fields", () => {
      expect(account.accessToken).toBeDefined();
      expect(account.refreshToken).toBeDefined();
      expect(account.idToken).toBeDefined();
    });

    it("has password field for email/password auth", () => {
      expect(account.password).toBeDefined();
    });
  });

  describe("verification table", () => {
    it("has all required columns", () => {
      expect(verification).toBeDefined();
      expect(verification.id).toBeDefined();
      expect(verification.identifier).toBeDefined();
      expect(verification.value).toBeDefined();
      expect(verification.expiresAt).toBeDefined();
      expect(verification.createdAt).toBeDefined();
      expect(verification.updatedAt).toBeDefined();
    });

    it("identifier is required", () => {
      expect(verification.identifier.notNull).toBe(true);
    });
  });
});
