// Test file for the runCmd function in the utils package
import { expect, test, describe } from "vite-plus/test";
import { runCmdSync, runCmdAsync, runCmdStreaming, isSuccess } from "@avoidstarch/ts-kit";

// Test isSuccess function
describe("isSuccess", () => {
  test("returns true for a success result", () => {
    const result = { success: true as const, data: "hello" };
    expect(isSuccess(result)).toBe(true);
  });

  test("returns false for a failure result", () => {
    const result = { success: false as const, error: new Error("fail") };
    expect(isSuccess(result)).toBe(false);
  });
});

// Test runCmdSync function
describe("runCmdSync", () => {
  /// Guard functions for invalid commands

  // Test guard for empty string command
  test("returns error for an empty string command", () => {
    const result = runCmdSync("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("Invalid command");
    }
  });

  test("returns error for a whitespace-only command", () => {
    const result = runCmdSync("   ");
    expect(result.success).toBe(false);
  });

  /// Test valid command execution

  test("returns output for a valid command", () => {
    const result = runCmdSync("echo hello");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  test("returns error for an invalid command", () => {
    const result = runCmdSync("not-a-real-command-xyz");
    expect(result.success).toBe(false);
  });

  /// Directory and timeout options

  test("runs in the specified directory", () => {
    const result = runCmdSync("pwd", { dir: "/tmp" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toContain("tmp");
    }
  });

  test("returns error when command exceeds timeout", () => {
    const result = runCmdSync("sleep 2", { timeoutInMillis: 50 });
    expect(result.success).toBe(false);
  });
});

// Test runCmdAsync function

describe("runCmdAsync", () => {
  /// Test valid command execution

  test("returns output for a valid command", async () => {
    const result = await runCmdAsync("echo hello");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stdout).toBe("hello");
      expect(result.data.stderr).toBe("");
    }
  });

  test("returns error for an invalid command", async () => {
    const result = await runCmdAsync("not-a-real-command-xyz");
    expect(result.success).toBe(false);
  });

  /// Directory and timeout options

  test("runs in the specified directory", async () => {
    const result = await runCmdAsync("pwd", { dir: "/tmp" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stdout).toContain("tmp");
    }
  });

  test("returns error when command exceeds timeout", async () => {
    const result = await runCmdAsync("sleep 2", { timeoutInMillis: 50 });
    expect(result.success).toBe(false);
  });
});

// Test runCmdStreaming function

describe("runCmdStreaming", () => {
  // Test valid command execution with streaming output

  test("returns success with streams for a valid command", () => {
    const result = runCmdStreaming("echo", ["hello"], false);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stdout).toBeDefined();
      expect(result.data.stderr).toBeDefined();
      expect(result.data.process).toBeDefined();
    }
  });

  // Test collecting stdout data from the stream

  test("collects stdout data from stream", async () => {
    const result = runCmdStreaming("echo", ["hello"], false);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const output = await new Promise<string>((resolve) => {
      let chunks = "";
      result.data.stdout.on("data", (data: Buffer | string) => {
        chunks += data.toString();
      });
      result.data.stdout.on("end", () => resolve(chunks.trim()));
    });

    expect(output).toBe("hello");
  });

  /// Test dir and timeout options

  // Note: Testing the timeout behavior of runCmdStreaming can be tricky because it involves ensuring that the child process is properly killed when the timeout is exceeded. This can depend on how the underlying spawn function handles timeouts and signals. In this test, we will check if the process receives a SIGTERM signal when the timeout is exceeded, which is a common way for Node.js to terminate child processes.

  test("runs in the specified directory", async () => {
    const result = runCmdStreaming("pwd", [], false, { dir: "/tmp" });
    expect(result.success).toBe(true);
    if (!result.success) return;

    const output = await new Promise<string>((resolve) => {
      let chunks = "";
      result.data.stdout.on("data", (data: Buffer | string) => {
        chunks += data.toString();
      });
      result.data.stdout.on("end", () => resolve(chunks.trim()));
    });

    expect(output).toContain("tmp");
  });

  // Test that the process is killed when the timeout is exceeded

  test("kills process when timeout is exceeded", async () => {
    const result = runCmdStreaming("sleep", ["2"], false, { timeoutInMillis: 50 });
    expect(result.success).toBe(true);
    if (!result.success) return;

    const signal = await new Promise<string | null>((resolve) => {
      result.data.process?.on("close", (_code: number, signal) => resolve(signal));
    });

    expect(signal).toBe("SIGTERM");
  });
});
