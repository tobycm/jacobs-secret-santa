import { SlashCommandBuilder } from "discord.js";
import { Command } from "./command";

const data = new SlashCommandBuilder().setName("whitelist").setDescription("Add a user to the Minecraft server whitelist.");

data.addStringOption((option) => option.setName("username").setDescription("The username to whitelist").setRequired(true));

export default new Command({
  data,
  async execute(interaction) {
    const username = interaction.options.getString("username");

    if (!interaction.channel?.isSendable()) {
      await interaction.reply({ content: "I can't send messages in this channel!", ephemeral: true });
      return;
    }

    const result = await interaction.client.rcon.send(`whitelist add ${username}`);

    if (result.includes("is already whitelisted")) {
      await interaction.reply({ content: `${username} is already whitelisted!`, ephemeral: true });
      return;
    }

    if (result.includes("Added")) {
      await interaction.channel.send({
        content: `${username} has been whitelisted!`,
        allowedMentions: { parse: ["users"] },
      });

      await interaction.reply({ content: `${username} has been whitelisted!`, ephemeral: true });
      return;
    }

    if (result.includes("does not exist")) {
      await interaction.reply({ content: `No such player: ${username}`, ephemeral: true });
      return;
    }

    await interaction.reply({ content: `An unknown error occurred while trying to whitelist the user. Error: ${result}`, ephemeral: true });
  },
});
