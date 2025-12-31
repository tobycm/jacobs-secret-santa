import { SlashCommandBuilder } from "discord.js";
import { Command } from "./command";

const data = new SlashCommandBuilder().setName("exfiltrate").setDescription("the mod thief has arrived");

export default new Command({
  data,
  async execute(interaction) {
    if (interaction.user.id != "842323924368621630") {
      await interaction.reply({ content: "bleh", ephemeral: true });
      return;
    }

    if (!interaction.channel?.isSendable()) {
      await interaction.reply({ content: "I can't send messages in this channel!", ephemeral: true });
      return;
    }

    const messages = await interaction.channel.messages.fetch({ limit: 500 });
    const modrinthLinks = messages
      .filter((msg) => msg.content.includes("modrinth.com"))
      .map((msg) => msg.content.match(/https?:\/\/modrinth\.com\/[^\s]+/g))
      .flat()
      .filter((link): link is string => link !== null);

    if (modrinthLinks.length === 0) {
      await interaction.reply({ content: "No Modrinth links found in the last 500 messages.", ephemeral: true });
      return;
    }

    await interaction.channel.send({
      content: modrinthLinks.join("\n"),
      allowedMentions: { parse: ["users"] },
    });

    await interaction.reply({ content: "Modrinth links have been exfiltrated!", ephemeral: true });
  },
});
