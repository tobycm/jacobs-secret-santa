import type { GoogleGenAI } from "@google/genai";
import { Client, type ClientOptions } from "discord.js";
import { Command } from "./commands/command";
import type CRcon from "./CRcon";

interface JacobOptions extends ClientOptions {
  ai: GoogleGenAI;
  rcon: CRcon;
}

export default class Jacob<Ready extends boolean = boolean> extends Client<Ready> {
  constructor(options: JacobOptions) {
    super(options);

    this.ai = options.ai;
    this.rcon = options.rcon;
  }

  commands = new Map<string, Command>();

  ai: GoogleGenAI;
  rcon: CRcon;
}
