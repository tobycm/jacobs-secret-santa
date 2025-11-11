import ask from "./ask";
import type { Command } from "./command";
import vaporize from "./vaporize";

export default {
  ask,
  vaporize,
} as Record<string, Command>;
