const { SlashCommandBuilder } = require("@discordjs/builders");
const { skipSong } = require("../runtime/player");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip a song"),
  async execute(interaction) {
    try {
      const skippedSong = await skipSong();
      interaction.reply({ content: `Skipped ${skippedSong.title}` });
    } catch (err) {
      interaction.reply({ content: "No songs in queue!" });
    }
  },
};
