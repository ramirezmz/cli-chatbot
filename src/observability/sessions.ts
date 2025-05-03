import logger from "./logger.ts";
import fs from "fs";
import path from "path";

interface CommandMetrics {
  command: string;
  totalUsage: number;
  lastUsed: Date;
}

interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  commandsUsed: Map<string, number>;
  duration?: number;
}

// In-memory analytics store
const commandMetrics = new Map<string, CommandMetrics>();
const sessions = new Map<string, SessionMetrics>();
const analyticsDir = path.join(process.cwd(), "analytics");

// Create analytics directory if it doesn't exist
if (!fs.existsSync(analyticsDir)) {
  fs.mkdirSync(analyticsDir, { recursive: true });
}

/**
 * Generate a unique session ID
 * @returns Unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Start a new user session
 * @returns Session ID
 */
export function startSession(): string {
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    sessionId,
    startTime: new Date(),
    commandsUsed: new Map(),
  });

  logger.info({
    message: `New session started: ${sessionId}`,
    sessionId,
    startTime: new Date(),
  });

  return sessionId;
}

/**
 * End a user session
 * @param sessionId Session ID to end
 */
export function endSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (!session) {
    logger.warn(`Attempted to end non-existent session: ${sessionId}`);
    return;
  }

  const endTime = new Date();
  const duration = endTime.getTime() - session.startTime.getTime();
  session.duration = duration;

  logger.info({
    message: `Session ended: ${sessionId}`,
    sessionId,
    duration: `${(duration / 1000).toFixed(2)}s`,
    commandsUsed: Array.from(session.commandsUsed.entries()).map(
      ([cmd, count]) => ({ command: cmd, count })
    ),
  });

  // Save session data to file
  const sessionData = {
    sessionId,
    startTime: session.startTime,
    endTime,
    duration,
    commandsUsed: Array.from(session.commandsUsed.entries()).map(
      ([cmd, count]) => ({ command: cmd, count })
    ),
  };

  try {
    fs.writeFileSync(
      path.join(analyticsDir, `session_${sessionId}.json`),
      JSON.stringify(sessionData, null, 2)
    );
  } catch (error) {
    logger.error(
      `Failed to save session data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Record usage of a command
 * @param sessionId Current session ID
 * @param command Command used
 */
export function recordCommandUsage(sessionId: string, command: string): void {
  // Update session metrics
  const session = sessions.get(sessionId);
  if (session) {
    const currentCount = session.commandsUsed.get(command) || 0;
    session.commandsUsed.set(command, currentCount + 1);
  } else {
    logger.warn(`Recorded command for non-existent session: ${sessionId}`);
  }

  // Update overall command metrics
  const metrics = commandMetrics.get(command) || {
    command,
    totalUsage: 0,
    lastUsed: new Date(),
  };

  metrics.totalUsage += 1;
  metrics.lastUsed = new Date();
  commandMetrics.set(command, metrics);

  logger.debug({
    message: `Command used: ${command}`,
    command,
    sessionId,
  });
}

/**
 * Get metrics for all commands
 * @returns Map of all command metrics
 */
export function getCommandMetrics(): Map<string, CommandMetrics> {
  return commandMetrics;
}

/**
 * Log summary of all command metrics
 */
export function logCommandMetricsSummary(): void {
  const metrics = Array.from(commandMetrics.values());

  logger.info({
    message: `Command Usage Summary: ${metrics.length} commands tracked`,
    totalCommands: metrics.length,
    totalUsage: metrics.reduce((sum, m) => sum + m.totalUsage, 0),
    commandsByUsage: metrics
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .map((m) => ({ command: m.command, usage: m.totalUsage })),
  });
}
