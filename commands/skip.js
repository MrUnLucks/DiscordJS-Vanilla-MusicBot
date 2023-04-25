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
const { state, skip } = require("../runtime/queue");
const player = require("../runtime/player");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip a song"),
  async execute(interaction) {
    const skippedSong = skip();
    /*Stops playback of the current resource and destroys the resource.
     The player will either transition to the Idle state,
     or remain in its current state until the silence padding frames of the resource have been played. */
    if (!skippedSong) {
      return interaction.reply({
        content: `The queue is empty`,
      });
    }
    player.stop();
    return interaction.reply({
      content: `Skipped **${skippedSong.title}**`,
    });
  },
};
