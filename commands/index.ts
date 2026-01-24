import ask from "./ask";
import type { Command } from "./command";
import exfiltrate from "./exfiltrate";
import shuffle from "./shuffle";
import vaporize from "./vaporize";
import whitelist from "./whitelist";

export default {
  ask,
  vaporize,
  shuffle,
  exfiltrate,
  whitelist,
} as Record<string, Command>;
