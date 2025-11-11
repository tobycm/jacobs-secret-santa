import { SlashCommandBuilder } from "discord.js";
import { Command } from "./command";

const data = new SlashCommandBuilder().setName("ask").setDescription("Ask someone else for gift feedback.");

data.addStringOption((option) => option.setName("question").setDescription("The question to ask").setRequired(true));

export default new Command({
  data,
  async execute(interaction) {
    const question = interaction.options.getString("question");

    if (!interaction.channel?.isSendable()) {
      await interaction.reply({ content: "I can't send messages in this channel!", ephemeral: true });
      return;
    }

    await interaction.channel.send({
      content: `${question}`,
      allowedMentions: { parse: ["users"] },
    });

    await interaction.reply({ content: "Your question has been sent!", ephemeral: true });
  },
});
