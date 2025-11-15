import { bold, inlineCode, Message, MessageFlags, SlashCommandBuilder } from "discord.js";
import { pickRandom } from "../utils";
import { Command } from "./command";

const data = new SlashCommandBuilder().setName("shuffle").setDescription("Pick a roster of random gift recipients.");

data.addBooleanOption((option) => option.setName("delete").setDescription("Whether to delete the messages after a delay").setRequired(false));

const roleId = "1437642724164763678";

export default new Command({
  data,
  async execute(interaction) {
    if (!["487597510559531009", "1037524319259074690"].includes(interaction.user.id)) {
      await interaction.reply({ content: "bleh", flags: [MessageFlags.Ephemeral] });
      return;
    }

    const members = interaction.guild?.roles.cache
      .get(roleId)
      ?.members.filter((member) => !member.user.bot)
      .map((member) => member.user);

    if (!members || members.length < 2) {
      await interaction.reply({ content: "Not enough members with the specified role to shuffle.", flags: [MessageFlags.Ephemeral] });
      return;
    }

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    // Shuffle the members array
    for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j]!, members[i]!];
    }

    // Create pairs
    const givers = [...members];
    const receivers = [...members];

    const messages: Message[] = [];
    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i]!;
      let receiver = pickRandom(receivers);

      // Ensure a giver does not get themselves
      while (receiver === giver) {
        receiver = pickRandom(receivers);
      }

      const message = await giver.send(`You have been assigned to give a gift to ${bold(inlineCode(receiver.username))}! 🎁`);
      messages.push(message);

      // Remove the assigned receiver from the list
      const index = receivers.indexOf(receiver);
      if (index > -1) {
        receivers.splice(index, 1);
      }
    }

    await interaction.followUp({ content: "The gift recipients have been shuffled and sent to the channel!", flags: [MessageFlags.Ephemeral] });

    const deleteOption = interaction.options.getBoolean("delete");
    if (!deleteOption) return;

    await new Promise((resolve) => setTimeout(resolve, 20000));

    for (const msg of messages) {
      await msg.delete();
    }
  },
});
