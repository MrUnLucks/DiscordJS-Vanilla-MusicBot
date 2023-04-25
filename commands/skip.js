const { SlashCommandBuilder } = require("@discordjs/builders");
const songFinder = require("../utils/songFinder");
const ytstream = require("play-dl");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const { state, skip } = require("../runtime/queue");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip a song"),
  async execute(interaction) {
    try {
      const skippedSong = skip();
      return interaction.reply({
        content: `Skipped **${skippedSong.title}**`,
      });
    } catch (err) {
      return interaction.reply({
        content: `The queue is empty`,
      });
    }
  },
};
