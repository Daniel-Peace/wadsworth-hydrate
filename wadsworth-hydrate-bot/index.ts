import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import { token } from "./botConfig.json";
import path from "path";
import fs from "fs";

import type { Command } from "./types/command";

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as Client & {
  commands: Collection<string, Command>;
};

client.commands = new Collection();

const commandsDirectoryPath = path.resolve("commands");

const commandFiles = fs
  .readdirSync(commandsDirectoryPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = await import(path.join(commandsDirectoryPath, file));
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;


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

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
