import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "../header";

vi.mock("../user-menu", () => ({
  default: () => <div data-testid="user-menu">User Menu</div>,
}));

describe("Header", () => {
  it("renders navigation links", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Todos")).toBeInTheDocument();
  });

  it("renders user menu", () => {
    render(<Header />);

    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  it("has navigation links pointing to correct routes", () => {
    render(<Header />);

    const homeLink = screen.getByText("Home");
    const dashboardLink = screen.getByText("Dashboard");
    const todosLink = screen.getByText("Todos");

    expect(homeLink).toHaveAttribute("href", "/");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    expect(todosLink).toHaveAttribute("href", "/todos");
  });
});
