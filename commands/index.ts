import ask from "./ask";
import type { Command } from "./command";
import shuffle from "./shuffle";
import vaporize from "./vaporize";

export default {
  ask,
  vaporize,
  shuffle,
} as Record<string, Command>;
