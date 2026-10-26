import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CategoryNav } from "@/components/layout/category-nav";
import { AllToolsLink } from "@/components/layout/all-tools-link";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
afterEach(() => { cleanup(); vi.useRealTimers(); route.pathname = "/"; });

describe("navbar", () => {
  it("keeps outside pointer events enabled while hover menu is open", () => {
    render(<CategoryNav />);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Tools" }).parentElement!);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(document.body.style.pointerEvents).not.toBe("none");
  });
  it("stays open when crossing from trigger to panel, then closes after leaving", () => {
    vi.useFakeTimers();
    render(<CategoryNav />);
    const trigger = screen.getByRole("button", { name: "Tools" });
    fireEvent.mouseEnter(trigger.parentElement!);
    fireEvent.mouseLeave(trigger.parentElement!);
    act(() => { vi.advanceTimersByTime(120); });
    fireEvent.mouseEnter(screen.getByRole("menu"));
    act(() => { vi.advanceTimersByTime(300); });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseLeave(screen.getByRole("menu"));
    act(() => { vi.advanceTimersByTime(230); });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("marks the current tool and its parent navigation", () => {
    route.pathname = "/tools/word-counter";
    render(<CategoryNav />);
    const trigger = screen.getByRole("button", { name: "Tools" });
    expect(trigger).toHaveAttribute("aria-current", "location");
    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.getByRole("menuitem", { name: "Word Counter" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });
  it("marks Home, About and All Tools only on their own routes", () => {
    const view = render(<CategoryNav />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    route.pathname = "/about";
    view.rerender(<CategoryNav />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    view.unmount();
    route.pathname = "/tools";
    render(<AllToolsLink />);
    expect(screen.getByRole("link", { name: "All Tools" })).toHaveAttribute("aria-current", "page");
  });
});
