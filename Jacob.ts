import type { GoogleGenAI } from "@google/genai";
import { Client, type ClientOptions } from "discord.js";
import { Command } from "./commands/command";

interface JacobOptions extends ClientOptions {
  ai: GoogleGenAI;
}

export default class Jacob<Ready extends boolean = boolean> extends Client<Ready> {
  constructor(options: JacobOptions) {
    super(options);

    this.ai = options.ai;
  }

  commands = new Map<string, Command>();

  ai: GoogleGenAI;
}
