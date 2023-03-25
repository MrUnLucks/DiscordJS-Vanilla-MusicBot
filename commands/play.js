const { SlashCommandBuilder } = require("@discordjs/builders");
const songFinder = require("../utils/songFinder");
const ytdl = require("ytdl-core");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from Youtube")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Song to be reproduced")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );
    const voiceChannelId = member.voice.channelId;
    if (voiceChannelId == null) {
      return interaction.reply({
        content: "You need to be in a voice channel to request a song",
        ephemeral: true,
      });
    }
    let player = createAudioPlayer();
    player.on("error", (error) => {
      console.error("Error:", error.message);
    });
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("The audio player has started playing!");
    });
    player.on(AudioPlayerStatus.AutoPaused, () => {
      console.log("The audio player has paused!");
    });
    player.on(AudioPlayerStatus.Buffering, () => {
      console.log("The audio player has buffering!");
    });
    let userQuery = interaction.options._hoistedOptions[0].value;
    let song = await songFinder(userQuery);
    if (!ytdl.validateURL(song.url)) {
      return interaction.reply({
        content: "Invalid URL",
        ephemeral: true,
      });
    }
    const stream = createAudioResource(ytdl(song.url, { filter: "audioonly" }));
    joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    }).subscribe(player);
    player.play(stream);

    // if (ytdl.validateURL(song.url)) {
    //   const stream = createAudioResource(
    //     ytdl(song.url, { filter: "audioonly" })
    //   );
    //   joinVoiceChannel({
    //     channelId: voiceChannelId,
    //     guildId: interaction.guild.id,
    //     adapterCreator: interaction.guild.voiceAdapterCreator,
    //   }).subscribe(player);
    //   player.play(stream);
    // }
    // connection.on(
    //   VoiceConnectionStatus.Disconnected,
    //   async (oldState, newState) => {
    //     try {
    //       await Promise.race([
    //         entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
    //         entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
    //       ]);
    //       // Seems to be reconnecting to a new channel - ignore disconnect
    //     } catch (error) {
    //       // Seems to be a real disconnect which SHOULDN'T be recovered from
    //       connection.destroy();
    //     }
    //   }
    // );
    // await interaction.reply({
    //   content: `You searched for ${song.title}!`,
    //   ephemeral: true,
    // });
  },
};
