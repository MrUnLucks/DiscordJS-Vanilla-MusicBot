const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Skip all songs and disconnects from server"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
      connection.unsubscribe();
      connection.destroy();
      await interaction.reply("Leaving...");
    } else {
      await interaction.reply({
        content: "Not connected to any voice channel at the moment",
        ephemeral: true,
      });
    }
  },
};
