const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");
const { resetQueue } = require("../runtime/queue");
const { skipSong } = require("../runtime/player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("DO NOT USE! Skip all songs and disconnects from server"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
      connection.destroy();
      try {
        skipSong();
      } catch (e) {
        console.log(e);
      }
      resetQueue();
      await interaction.reply("Leaving...");
    } else {
      await interaction.reply({
        content: "Not connected to any voice channel at the moment",
        ephemeral: true,
      });
    }
  },
};
