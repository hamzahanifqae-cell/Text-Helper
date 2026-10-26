import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTextHistory } from "@/hooks/use-text-history";

describe("useTextHistory", () => {
  it("starts with the initial value and no history", () => {
    const { result } = renderHook(() => useTextHistory("start"));
    expect(result.current.value).toBe("start");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("supports undo after a change", () => {
    const { result } = renderHook(() => useTextHistory(""));
    act(() => result.current.set("hello"));
    expect(result.current.value).toBe("hello");
    expect(result.current.canUndo).toBe(true);
    act(() => result.current.undo());
    expect(result.current.value).toBe("");
    expect(result.current.canUndo).toBe(false);
  });

  it("supports redo after an undo", () => {
    const { result } = renderHook(() => useTextHistory(""));
    act(() => result.current.set("hello"));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.redo());
    expect(result.current.value).toBe("hello");
  });

  it("clears the redo stack when a new change is made after undo", () => {
    const { result } = renderHook(() => useTextHistory(""));
    act(() => result.current.set("a"));
    act(() => result.current.undo());
    act(() => result.current.set("b"));
    expect(result.current.canRedo).toBe(false);
    expect(result.current.value).toBe("b");
  });

  it("clear() empties the text and is itself undoable", () => {
    const { result } = renderHook(() => useTextHistory("keep me"));
    act(() => result.current.clear());
    expect(result.current.value).toBe("");
    act(() => result.current.undo());
    expect(result.current.value).toBe("keep me");
  });

  it("reset() wipes history entirely (used after importing a file)", () => {
    const { result } = renderHook(() => useTextHistory(""));
    act(() => result.current.set("a"));
    act(() => result.current.reset("fresh content"));
    expect(result.current.value).toBe("fresh content");
    expect(result.current.canUndo).toBe(false);
  });
});
