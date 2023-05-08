const EventEmitter = require("events");

class Queue extends EventEmitter {
  constructor() {
    super();
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
    this.emit(this.items.length == 0 ? "firstSongAdded" : "songAdded", item);
  }

  dequeue() {
    if (this.items.length === 0) {
      this.emit("queueEmpty");
    }
    const item = this.items.shift();
    this.emit("songRemoved", item);
    return item;
  }

  reset() {
    this.items = [];
  }

  get length() {
    return this.items.length;
  }
}

const queue = new Queue();

module.exports = { queue };
