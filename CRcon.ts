import { Rcon, type RconOptions } from "rcon-client";

interface CRconOptions extends RconOptions {
  /**
   * The delay in milliseconds before attempting to reconnect after a disconnection.
   * @default 10000 ms
   */
  reconnectDelay?: number;
  /**
   * The number of reconnection attempts before giving up.
   * @default 20
   */
  reconnectAttempts?: number;
}

export default class CRcon extends Rcon {
  private reconnectDelay: number;
  private maxReconnectAttempts: number;
  private isReconnecting: boolean = false;

  constructor(options: CRconOptions) {
    super(options);

    this.reconnectDelay = options.reconnectDelay ?? 10_000;
    this.maxReconnectAttempts = options.reconnectAttempts ?? 20;

    this.on("connect", () => {
      console.log("CRcon: Connected to Rcon server.");
    });

    this.on("authenticated", () => {
      console.log("CRcon: Authenticated with Rcon server.");
    });

    // Handle "Network Error" (Crash, Timeout, ECONNRESET)
    this.on("error", (err) => {
      console.error("CRcon Error:", err.message);
      this.handleDisconnect();
    });

    // Handle "Graceful Shutdown" (Server restart, /stop command)
    this.on("end", () => {
      console.warn("CRcon: Connection ended by server (restart/stop).");
      this.handleDisconnect();
    });
  }

  private handleDisconnect() {
    // Prevent multiple listeners (error + end) from triggering parallel reconnects
    if (this.isReconnecting) return;

    this.isReconnecting = true;
    this.attemptReconnect(1);
  }

  private attemptReconnect(attempt: number) {
    if (attempt > this.maxReconnectAttempts) {
      console.error("CRcon: Max reconnection attempts reached. Giving up.");
      this.isReconnecting = false;
      return;
    }

    console.log(`CRcon: Reconnecting in ${this.reconnectDelay}ms... (Attempt ${attempt}/${this.maxReconnectAttempts})`);

    setTimeout(async () => {
      try {
        // Force cleanup of old socket before trying again to avoid 'Socket is already connected' errors
        this.end();

        await this.connect();

        console.log("CRcon: Reconnected successfully!");
        this.isReconnecting = false;
      } catch (e) {
        // If connection fails, loop recursively
        this.attemptReconnect(attempt + 1);
      }
    }, this.reconnectDelay);
  }
}
