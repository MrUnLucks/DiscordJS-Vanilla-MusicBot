const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  getVoiceConnection,
} = require("@discordjs/voice");
const { queue } = require("./queue");
const { stream } = require("play-dl");

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

player.on(AudioPlayerStatus.Idle, () => {
  try {
    skipSong();
  } catch (err) {}
});

const playSong = async () => {
  let streamResource = await stream(queue[0].url);
  let resource = createAudioResource(streamResource.stream, {
    inputType: stream.type,
  });
  player.play(resource);
};

const skipSong = () => {
  /*Stops playback of the current resource and DESTROYS THE RESOURCE.
     The player will either transition to the Idle state,
     or remain in its current state until the silence padding frames of the resource have been played. */
  if (queue.length === 0) {
    throw new Error("No skippable song");
  }
  player.stop();
  const skippedSong = queueSkip();
  if (queue.length !== 0) {
    playSong();
  }
  return skippedSong;
};

module.exports = { player, playSong, skipSong };
