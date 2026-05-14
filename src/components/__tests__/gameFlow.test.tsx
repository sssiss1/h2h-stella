import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { POST } from "@/app/api/dm/route";

function createStorageDouble(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    }
  };
}

describe("game flow", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createStorageDouble()
    });
    window.localStorage.clear();
  });

  it("creates a player and enters the Stella story", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByText("Stella 单人线")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "确定并生成角色卡" }));
    expect(screen.getByText("斯特拉（Stella）")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "进入剧情" }));
    expect(screen.getByText(/当前攻略对象：斯特拉（Stella）/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "小声表达善意，但不追问。" }));
    expect(screen.getByText("此前剧情")).toBeInTheDocument();
  });
});

describe("DM API route", () => {
  it("reports that the OpenAI provider is disabled", async () => {
    const response = await POST();

    expect(response.status).toBe(501);
    await expect(response.json()).resolves.toEqual({
      error: "OpenAI provider is not configured in version 1. Mock mode is active."
    });
  });
});
