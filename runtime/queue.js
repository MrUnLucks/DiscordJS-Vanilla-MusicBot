let state = {
  queue: [],
  currentSong: null,
  paused: false,
};

const add = (song) => {
  state.queue.push(song);
  state.paused = false;
};

const isEmpty = state.queue.length === 0;

const skip = () => {
  if (isEmpty) {
    throw new Error("No skippable songs");
  }
  const skippedSong = state.queue[0];
  state.queue.shift();
  state.currentSong = state.queue[0];
  state.paused = false;
  return skippedSong;
};

module.exports = { state, skip, add, isEmpty };
