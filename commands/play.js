const { SlashCommandBuilder } = require("@discordjs/builders");
const songFinder = require("../utils/songFinder");
const { yt_validate } = require("play-dl");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { playSong, player } = require("../runtime/player");
let { interactionGuildId } = require("../runtime/player");
const { queue, queueAdd } = require("../runtime/queue");

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
    //Checks on user state
    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );
    const voiceChannelId = member.voice.channelId;
    //TODO the VC can be exported into his separate module
    //If the VoiceConnection is not established create one
    if (!getVoiceConnection(interaction.guild.id)) {
      const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      connection.subscribe(player);
      interactionGuildId = interaction.guild.id;
    }
    let userQuery = interaction.options._hoistedOptions[0].value;
    //Search song
    interaction.reply({
      content: "Loading...",
      ephemeral: true,
    });
    let song = await songFinder(userQuery);
    //Checks on song
    if (!song) {
      return interaction.editReply({
        content: "No videos for this query",
        ephemeral: true,
      });
    }
    if (!yt_validate(song.url)) {
      return interaction.editReply({
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
    return interaction.editReply({
      content:
        queue.length === 0
          ? `Now playing **${song.title}**`
          : `**${song.title}** added to queue`,
    });
  },
};
