const { SlashCommandBuilder } = require("@discordjs/builders");
const songFinder = require("../utils/songFinder");
const { yt_validate } = require("play-dl");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  getVoiceConnection,
} = require("@discordjs/voice");
const { playSong, player } = require("../runtime/player");
const { queue, queueAdd } = require("../runtime/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playtest")
    .setDescription("Play a song from Youtube")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Song to be reproduced")
        .setRequired(true)
    ),
  async execute(interaction) {
    //Checks on user state
    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );
    const voiceChannelId = member.voice.channelId;
    //If the VoiceConnection is not established create one
    if (!getVoiceConnection(interaction.guild.id)) {
      joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      getVoiceConnection(interaction.guild.id).subscribe(player);
    }
    let userQuery = interaction.options._hoistedOptions[0].value;
    //Search song
    let song = await songFinder(userQuery);
    //Checks on song
    if (!song) {
      return interaction.reply({
        content: "No videos for this query",
        ephemeral: true,
      });
    }
    if (!yt_validate(song.url)) {
      return interaction.reply({
        content: "Invalid URL or queue",
        ephemeral: true,
      });
    }
    //Play now if queue is empty
    if (queue.length === 0) {
      queueAdd(song);
      await playSong();
    } else {
      queueAdd(song);
    }
    return interaction.reply({
      content:
        queue.length === 0
          ? `Now playing **${song.title}**`
          : `**${song.title}** added to queue`,
    });
  },
};
