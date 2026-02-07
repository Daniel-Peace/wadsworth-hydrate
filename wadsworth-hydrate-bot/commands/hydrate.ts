import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";

// This flag is used used to indicate if a command is ready for production or not
export const productionReady = true;

// This creates the slash command itself. Things like names, descriptions and all that go here
export const data = new SlashCommandBuilder()
  .setName("hydrate")
  .setDescription("Reminds gamers to hydrate.");

export async function execute(interaction: ChatInputCommandInteraction) {
  // Get the channel ID of the channel that the command was sent from
  const channelId = interaction.channelId;

  // Get the channel given the channel ID
  const channel = await interaction.client.channels.fetch(channelId);

  // Make sure the channel is not null and is text based
  if (!channel || !channel.isSendable()) {
    interaction.reply({content: "Oops, failed to send message", flags: MessageFlags.Ephemeral});
  } else {
    interaction.reply({content: "Okay, I'll remind every to hydrate 👍", flags: MessageFlags.Ephemeral});
    await channel.send("Did you know that 9 out of 10 gamers suffer from dehydration? Drink up gamers! 🥤");
  }
}
