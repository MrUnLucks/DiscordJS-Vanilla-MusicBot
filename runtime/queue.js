let state = {
  queue: [],
  currentSong: null,
  paused: false,
};

const add = (song) => {
  state.queue.push(song);
  state.paused = false;
};

const skip = () => {
  if (state.queue.length === 0) {
    return undefined;
  }
  const skippedSong = state.queue[0];
  state.queue.shift();
  state.currentSong = state.queue[0];
  state.paused = false;
  return skippedSong;
};

module.exports = { state, skip, add };
