import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type Jacob from "../Jacob";

export interface ChatInputCommandInteractionExtended extends ChatInputCommandInteraction {
  client: Jacob<true>;
}

export interface CommandOptions {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteractionExtended) => Promise<void>;
}

export class Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteractionExtended) => Promise<void>;

  constructor(options: CommandOptions) {
    this.data = options.data;
    this.execute = options.execute;
  }
}
