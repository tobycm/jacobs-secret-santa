import { GoogleGenAI } from "@google/genai";
import "discord.js";
import { Command } from "./commands/command";

declare module "discord.js" {
  export interface Client {
    commands: Map<string, Command>;

    ai: GoogleGenAI;
  }
}
