import ask from "./ask";
import type { Command } from "./command";
import exfiltrate from "./exfiltrate";
import minecraft from "./minecraft";
import shuffle from "./shuffle";
import vaporize from "./vaporize";

export default {
  ask,
  vaporize,
  shuffle,
  exfiltrate,
  minecraft,
} as Record<string, Command>;
