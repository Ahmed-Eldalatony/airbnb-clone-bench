import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SignInForm from "../sign-in-form";

describe("SignInForm", () => {
  it("renders the sign-in form", () => {
    render(<SignInForm onSwitchToSignUp={vi.fn()} />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("has a sign in button", () => {
    render(<SignInForm onSwitchToSignUp={vi.fn()} />);

    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("has a link to sign up", () => {
    render(<SignInForm onSwitchToSignUp={vi.fn()} />);

    expect(screen.getByText(/need an account\? sign up/i)).toBeInTheDocument();
  });

  it("calls onSwitchToSignUp when clicking sign up link", async () => {
    const user = userEvent.setup();
    const onSwitchToSignUp = vi.fn();

    render(<SignInForm onSwitchToSignUp={onSwitchToSignUp} />);

    await user.click(screen.getByText(/need an account\? sign up/i));

    expect(onSwitchToSignUp).toHaveBeenCalled();
  });

  it("validates email is required", async () => {
    const user = userEvent.setup();

    render(<SignInForm onSwitchToSignUp={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);
    await user.tab();

    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });
});
