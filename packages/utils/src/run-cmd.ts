// This library is used to run a command in a child process and return the output as a string.

import { spawn, exec, execSync } from "child_process";
import path from "path";

// Stream-based execution of a command using spawn - best for Larger outputs or when you want to process output in real-time or long running tasks

// Standard output and error objects are streams, so you can listen to their 'data' events to capture output in real-time. The 'close' event is emitted when the process exits, allowing you to detect when the command has finished executing.

export type Std_Streams = {
  stdout: NodeJS.ReadableStream;
  stderr: NodeJS.ReadableStream;
  process?: ReturnType<typeof spawn>;
};

export type Cmd_Result<T> = { success: true; data: T } | { success: false; error: Error };

// Command and arguments must be separated when using spawn, and the command is not run in a shell by default, so you need to provide the command and its arguments as separate parameters. If you want to run a command in a shell, you can set the shell option to true.
export function runCmdStreaming(
  cmd_name: string,
  cmd_args: string[] = [],
  use_shell: boolean,
  options?: {
    dir?: string;
    timeoutInMillis?: number;
  },
): Cmd_Result<Std_Streams> {
  // Spawn the command with the provided arguments and shell option
  const cwd = options?.dir ? path.resolve(options.dir) : undefined;
  const cmd = spawn(cmd_name, cmd_args, { shell: use_shell, cwd });

  // Ensure that the stdout and stderr streams are available before returning the Cmd_Result object. If either stream is missing, return an error indicating that the spawn function did not create the expected stdio streams. This helps prevent runtime errors when trying to access the streams later on.
  if (!cmd.stdout || !cmd.stderr) {
    return { success: false, error: new Error("spawn did not create stdio streams") };
  }
  // Timeout handling: If a timeout is specified, set a timer to kill the process if it exceeds the specified duration. This helps prevent hanging processes and allows you to handle long-running commands gracefully.
  if (options?.timeoutInMillis) {
    const timer = setTimeout(() => cmd.kill("SIGTERM"), options.timeoutInMillis);
    cmd.on("close", () => clearTimeout(timer));
  }
  // If the streams are available, return a successful Cmd_Result object containing the output streams. This allows the caller to access both the standard output and error streams for further processing or real-time handling of the command's output.
  const output_streams: Std_Streams = { stdout: cmd.stdout, stderr: cmd.stderr, process: cmd };
  return { success: true, data: output_streams };
}

// Asynchronous execution of a command using exec

export function runCmdAsync(
  cmd: string,
  options?: {
    dir?: string;
    timeoutInMillis?: number;
  },
): Promise<Cmd_Result<{ stdout: string; stderr: string }>> {
  // Create a new Promise that will execute the command and resolve with the output or reject with an error. The exec function runs the command in a shell and buffers the output, which is suitable for commands that produce a small amount of output. If the command produces a large amount of output, it may cause the buffer to overflow, so be cautious when using exec with commands that generate a lot of output.
  return new Promise((resolve) => {
    exec(
      cmd,
      {
        cwd: options?.dir ? path.resolve(options.dir) : undefined,
        timeout: options?.timeoutInMillis,
      },
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) return resolve({ success: false, error });
        resolve({ success: true, data: { stdout: stdout.trim(), stderr: stderr.trim() } });
      },
    );
  });
}

export function runCmdSync(
  cmd: string,
  options?: {
    dir?: string;
    timeoutInMillis?: number;
  },
): Cmd_Result<string> {
  // Enclose risky operations in a try-catch block to handle potential errors gracefully, such as command execution failures or invalid input. This allows you to provide informative error messages and prevent your application from crashing due to unhandled exceptions.
  // This should always return a string, even if the command fails, so we catch any errors and return a message instead of throwing an exception.
  try {
    // Guard: Ensure the command is a non-empty string before executing
    if (typeof cmd !== "string" || cmd.trim() === "") {
      throw new Error("Invalid command: Command must be a non-empty string");
    }

    // Run the command and convert the returned buffer to a string
    const cwd = options?.dir ? path.resolve(options.dir) : undefined;
    const output = execSync(cmd, {
      encoding: "utf-8",
      cwd,
      timeout: options?.timeoutInMillis,
    });
    return { success: true, data: output.trim() };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error };
    } else {
      return { success: false, error: new Error(String(error)) };
    }
  }
}

export function isSuccess<T>(result: Cmd_Result<T>): result is { success: true; data: T } {
  return result.success === true;
}

// code example for using runCmdStreaming
/*
  const result = runCmdStreaming('ls', ['-la'], false);
  if (isSuccess(result)) {
    result.data.stdout.on('data', (data: Buffer | string) => { console.log(`Chunk: ${data}`); });
    result.data.stderr.on('data', (data: Buffer | string) => { console.error(`Error: ${data}`); });
    result.data.process?.on('close', (code: number | null) => { console.log(`Exit: ${code}`); });
  }
*/
