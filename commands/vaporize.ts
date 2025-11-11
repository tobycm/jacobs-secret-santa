import { SlashCommandBuilder } from "discord.js";
import { Command } from "./command";

const data = new SlashCommandBuilder().setName("vaporize").setDescription("xd");

data.addStringOption((option) => option.setName("id").setDescription("The message ID").setRequired(true));

export default new Command({
  data,
  async execute(interaction) {
    if (interaction.user.id != "487597510559531009") {
      await interaction.reply({ content: "bleh", ephemeral: true });
      return;
    }

    const id = interaction.options.getString("id", true);

    const message = await interaction.channel?.messages.fetch(id);
    if (!message) {
      await interaction.reply({ content: "Message not found!", ephemeral: true });
      return;
    }

    await message.delete();
    await interaction.reply({ content: "Message deleted!", ephemeral: true });
  },
});
