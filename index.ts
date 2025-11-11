import { GoogleGenAI } from "@google/genai";

import { Events, GatewayIntentBits } from "discord.js";
import Jacob from "./Jacob";
import commands from "./commands";
import type { ChatInputCommandInteractionExtended } from "./commands/command";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY || "" });

const jacob = new Jacob({ intents: [GatewayIntentBits.Guilds], ai });

const uploadCommands = Object.values(commands).map((command) => command.data);

jacob.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${jacob.user?.tag}`);

  try {
    if (!jacob.application) {
      throw new Error("Application not found");
    }

    await jacob.application.commands.set(uploadCommands);

    console.log(`Uploaded ${uploadCommands.length} commands to Discord`);
  } catch (error) {
    console.error("Error uploading commands:", error);
  }
});

jacob.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = jacob.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command found for ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction as ChatInputCommandInteractionExtended);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
    } else {
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  }
});

// Register commands in the client's command collection
for (const [name, command] of Object.entries(commands)) {
  jacob.commands.set(name, command);
}

jacob.login(process.env.DISCORD_BOT_TOKEN);

export default jacob;
