import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { pickRandom } from "../utils";
import { Command } from "./command";

const data = new SlashCommandBuilder().setName("shuffle").setDescription("Pick a roster of random gift recipients.");

const roleId = "1437642724164763678";

export default new Command({
  data,
  async execute(interaction) {
    if (!interaction.channel?.isSendable()) {
      await interaction.reply({ content: "I can't send messages in this channel!", ephemeral: true });
      return;
    }

    const members = interaction.guild?.roles.cache
      .get(roleId)
      ?.members.filter((member) => !member.user.bot)
      .map((member) => member.user.username);

    if (!members || members.length < 2) {
      await interaction.reply({ content: "Not enough members with the specified role to shuffle.", ephemeral: true });
      return;
    }

    // Shuffle the members array
    for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [members[i], members[j]] = [members[j]!, members[i]!];
    }

    // Create pairs
    const givers = [...members];
    const receivers = [...members];

    const pairs: string[] = [];
    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i]!;
      let receiver = pickRandom(receivers);

      // Ensure a giver does not get themselves
      while (receiver === giver) {
        receiver = pickRandom(receivers);
      }

      pairs.push(`${giver} → ${receiver}`);

      // Remove the assigned receiver from the list
      const index = receivers.indexOf(receiver);
      if (index > -1) {
        receivers.splice(index, 1);
      }
    }

    await interaction.channel.send({
      content: `Here are the shuffled gift recipients:\n${pairs.join("\n")}`,
    });

    await interaction.reply({ content: "The gift recipients have been shuffled and sent to the channel!", flags: [MessageFlags.Ephemeral] });
  },
});
