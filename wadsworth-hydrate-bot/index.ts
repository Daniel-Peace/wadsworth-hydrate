import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import { token } from "../botConfig.json";
import path from "path";
import fs from "fs";

import type { Command } from "./types/command";

// Creating bot client also adding the property
const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as Client & {
  commands: Collection<string, Command>;
};

// Initializing the command collection to an empty collection
client.commands = new Collection();

// Get path to command directory
const commandsDirectoryPath = path.join(__dirname, "commands");

// Get all contents of directory and then filter it down to just files ending in ".ts"
const commandFiles = fs.readdirSync(commandsDirectoryPath).filter((file) => file.endsWith(".ts"));

// We loop over each file and import the "command" module and add it to the collection/map of commands
for (const file of commandFiles) {
  const command = await import(path.join(commandsDirectoryPath, file));
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Retreiving command object from collection/map based on name of received interaction
  const cammand = client.commands.get(interaction.commandName);
  if (!cammand) return;

  try {
    await cammand.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "There was an error!",
      ephemeral: true,
    });
  }
});

// Now we set up the listener for 

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
