import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SOSButton from "../SOSButton";

const toastMock = vi.hoisted(() => {
  const fn = vi.fn() as unknown as { (...args: unknown[]): void } & {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };
  fn.success = vi.fn();
  fn.error = vi.fn();
  fn.warning = vi.fn();
  fn.info = vi.fn();
  return fn;
});

vi.mock("sonner", () => ({ toast: toastMock }));

const invokeMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...args: unknown[]) => invokeMock(...args) } },
}));

let mockUser: { id: string } | null = null;
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

/** Runs the 5s countdown to completion so triggerSOS() fires. */
async function fireSOS() {
  fireEvent.click(screen.getByRole("button"));
  await act(async () => {
    vi.advanceTimersByTime(5000);
  });
  // triggerSOS awaits a geolocation promise + (for signed-in users) the
  // edge-function invoke promise before it gets to the toast calls.
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("SOSButton — SOS outcome messaging", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toastMock.success.mockClear();
    toastMock.error.mockClear();
    toastMock.warning.mockClear();
    toastMock.mockClear();
    invokeMock.mockReset();
    mockUser = null;
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (_ok: unknown, err: (e: unknown) => void) => err(new Error("denied")),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("never claims contacts were notified when the user isn't signed in", async () => {
    mockUser = null;
    render(<SOSButton />);
    await fireSOS();

    expect(invokeMock).not.toHaveBeenCalled();
    // No call anywhere should claim contacts were actually notified.
    const allCalls = [...toastMock.mock.calls, ...toastMock.success.mock.calls];
    for (const call of allCalls) {
      const text = JSON.stringify(call).toLowerCase();
      expect(text.includes("notified") && !text.includes("no one was notified")).toBe(false);
    }
    expect(toastMock.warning).toHaveBeenCalledWith(expect.stringContaining("no one was notified"));
  });

  it("does not show a success toast when the SMS send fails", async () => {
    mockUser = { id: "11111111-1111-1111-1111-111111111111" };
    invokeMock.mockResolvedValue({ data: null, error: new Error("gateway down") });
    render(<SOSButton />);
    await fireSOS();

    expect(toastMock.success).not.toHaveBeenCalled();
    expect(toastMock.error).toHaveBeenCalledWith(expect.stringContaining("could not be sent"));
  });

  it("does not show a success toast when there are no emergency contacts (sent: 0)", async () => {
    mockUser = { id: "11111111-1111-1111-1111-111111111111" };
    invokeMock.mockResolvedValue({ data: { sent: 0 }, error: null });
    render(<SOSButton />);
    await fireSOS();

    expect(toastMock.success).not.toHaveBeenCalled();
    expect(toastMock.warning).toHaveBeenCalledWith(expect.stringContaining("no SMS was sent"));
  });

  it("shows a real success toast only once contacts were actually notified", async () => {
    mockUser = { id: "11111111-1111-1111-1111-111111111111" };
    invokeMock.mockResolvedValue({ data: { sent: 2 }, error: null });
    render(<SOSButton />);
    await fireSOS();

    expect(toastMock.success).toHaveBeenCalledWith(expect.stringContaining("2 emergency contact"));
  });
});
