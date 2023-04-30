// Require the necessary discord.js classes
const { Client, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

// Create a new client instance
const client = new Client({ intents: 33667 /*[Intents.FLAGS.GUILDS]*/ });

client.commands = new Collection();
/*
    The fs.readdirSync() method will return an array of all the file names in a directory, e.g. ['ping.js', 'beep.js'].
    To ensure only command/events files get returned, use Array.filter() to leave out any non-JavaScript files from the array.
    With that array, loop over it and dynamically set your commands to the client.commands Collection.
*/
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}
/*  The Client class in discord.js extends the EventEmitter class. Therefore, the client object exposes the .on() and .once()

    methods that you can use to register event listeners. These methods take two arguments: the event name and a callback function.

    The callback function passed takes argument(s) returned by its respective event, collects them in an args array using the ... rest parameter syntax,
    then calls event.execute() while passing in the args array using the ... spread syntax

    They are used here because different events in discord.js have different numbers of arguments.
    The rest parameter collects these variable number of arguments into a single array,
    and the spread syntax then takes these elements and passes them to the execute function.

    After this, listening for other events is as easy as creating a new file in the events folder.
    The event handler will automatically retrieve and register it whenever you restart your bot. 
*/
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Login to Discord with your client's token
client.login();
