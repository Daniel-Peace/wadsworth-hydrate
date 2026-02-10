import { REST, Routes } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { clientId, guildId, token } from "./botConfig.json";
import fs from "fs";
import path from "path";
import { exit } from "process";

const args = process.argv.slice(2);

const option = validate_args(args);

const testCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const prodCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

const commandsDirectoryPath = path.join(__dirname, "commands");

const commandFiles = fs
  .readdirSync(commandsDirectoryPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsDirectoryPath, file);

  const command = await import(filePath);

  if ("data" in command && "execute" in command) {
    const serializedCommand = command.data.toJSON();
    if ("productionReady" in command && command.productionReady == true) {
      prodCommands.push(serializedCommand);
    } else {
      testCommands.push(serializedCommand);
    }
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing either the data or execute attribute`,
    );
  }
}

console.log("Production Ready Commands:");
for (const command of prodCommands) {
  console.log(`- ${command.name}`);
}

console.log("Test Commands:");
for (const command of testCommands) {
  console.log(`- ${command.name}`);
}

switch (option) {
  case "t":
    deploy_to_test(testCommands);
    break;

  case "p":
    deploy_to_prod(prodCommands);
    break;

  default:
    console.log("Unrecognizxed option flag. Aborting deployment.");
    break;
}

function deploy_to_test(
  commands: RESTPostAPIApplicationCommandsJSONBody[],
): void {
  console.log("Deploying to test servers");
  const rest = new REST().setToken(token);

  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
    } catch (error) {
      console.error(error);
    }
  })();
}

function deploy_to_prod(
  commands: RESTPostAPIApplicationCommandsJSONBody[],
): void {
  console.log("Deploying to prod servers");
  const rest = new REST().setToken(token);

  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
    } catch (error) {
      console.error(error);
    }
  })();
}

function validate_args(args: string[]): string {
  if (args.length !== 1) {
    console.log(
      `[ERROR] - incorrect number of args [required: 1 | found: ${args.length}]`,
    );
    console.log("options:\n- all\n- test\n- prod");
    console.log("\t$ bun run register-commands.ts <option>");
    exit(1);
  } else if (args[0] === undefined) {
    console.log("[ERROR] - arg undefined");
    console.log("options:\n- all\n- test\n- prod");
    console.log("\t$ bun run register-commands.ts <option>");
    exit(1);
  } else {
    return args[0];
  }
}
