/*The name property states which event this file is for, and the once property is a boolean that specifies if the event should run only once.
 The execute function is for your event logic, which will be called by the event handler whenever the event emits */

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log('Bot Login Successful!')
  },
};
