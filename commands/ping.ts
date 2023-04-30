import { SlashCommandBuilder } from "@discordjs/builders";
import type { Interaction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: Interaction) {
    await interaction.reply("Pong!");
  },
};
