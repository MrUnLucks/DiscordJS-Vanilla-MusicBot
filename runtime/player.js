const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  getVoiceConnection,
} = require("@discordjs/voice");
const { queue, queueSkip } = require("./queue");
const { stream } = require("play-dl");
let player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});
//TODO: I think the getVoiceConnection can be moved and referenced in another manner, to be evalued
let interactionGuildId = "";
//TODO:create a separate file for handling these types of events
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

const playSong = async () => {
  let streamResource = await stream(queue[0].url, { quality: 0 });
  let resource = createAudioResource(streamResource.stream, {
    inputType: streamResource.type,
  });
  player.play(resource);
};

const skipSong = async () => {
  /*Stops playback of the current resource and DESTROYS THE RESOURCE.
     The player will either transition to the Idle state,
     or remain in its current state until the silence padding frames of the resource have been played. */
  if (queue.length === 0) {
    throw new Error("No skippable song");
  }
  player.stop();
  const skippedSong = queueSkip();
  if (queue.length !== 0) {
    await playSong();
  }
  return skippedSong;
};

player.on(AudioPlayerStatus.Idle, async () => {
  try {
    await skipSong();
  } catch (err) {
    player.stop();
    //TODO!!:This need a better solution for handling the destroy
    console.log(interactionGuildId);
    if (interactionGuildId) {
      getVoiceConnection(interactionGuildId).unsubscribe();
      getVoiceConnection(interactionGuildId).destroy();
    }
  }
});

module.exports = { player, playSong, skipSong, interactionGuildId };
