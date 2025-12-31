import ask from "./ask";
import type { Command } from "./command";
import exfiltrate from "./exfiltrate";
import shuffle from "./shuffle";
import vaporize from "./vaporize";

export default {
  ask,
  vaporize,
  shuffle,
  exfiltrate,
} as Record<string, Command>;
