const { SlashCommandBuilder } = require("@discordjs/builders");
const songFinder = require("../utils/songFinder");
const ytstream = require("play-dl");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection,
  entersState,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
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
