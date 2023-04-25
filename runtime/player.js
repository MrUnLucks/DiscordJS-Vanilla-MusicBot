const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require("@discordjs/voice");

let player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});
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
module.exports = player;
