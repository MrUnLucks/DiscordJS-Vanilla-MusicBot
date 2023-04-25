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
  getVoiceConnection,
} = require("@discordjs/voice");
const { add: queueAdd, isEmpty } = require("../runtime/queue");
const player = require("../runtime/player");

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
    }
    let userQuery = interaction.options._hoistedOptions[0].value;
    //Checks
    let song = await songFinder(userQuery);
    if (!song) {
      return interaction.reply({
        content: "No videos for this query",
        ephemeral: true,
      });
    }

    if (!ytstream.yt_validate(song.url)) {
      return interaction.reply({
        content: "Invalid URL",
        ephemeral: true,
      });
    }
    //Add to queue
    queueAdd(song);
    if (!isEmpty) {
      interaction.reply({ content: `Added to queue ${song.title}` });
    } else {
      interaction.reply({ content: `Started queue with ${song.title}` });
      let stream = await ytstream.stream(song.url);

      let resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });
      player.play(resource);

      getVoiceConnection(interaction.guild.id).subscribe(player);
    }
  },
};
