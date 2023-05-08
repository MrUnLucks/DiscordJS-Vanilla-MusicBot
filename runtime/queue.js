let queue = [];

const queueAdd = (song) => {
  queue.push(song);
};

const queueSkip = () => {
  if (queue.length === 0) {
    return undefined;
  }
  const skippedSong = queue[0];
  queue.shift();
  return skippedSong;
};

const resetQueue = () => {
  queue = [];
};

module.exports = { queue, queueAdd, queueSkip, resetQueue };
