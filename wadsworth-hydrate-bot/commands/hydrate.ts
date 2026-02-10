import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";

export const productionReady = true;

export const data = new SlashCommandBuilder()
  .setName("hydrate")
  .setDescription("Reminds gamers to hydrate.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const channelId = interaction.channelId;

  const channel = await interaction.client.channels.fetch(channelId);

  if (!channel || !channel.isSendable()) {
    interaction.reply({ content: "Oops, failed to send message", flags: MessageFlags.Ephemeral });
  } else {
    interaction.reply({ content: "Okay, I'll remind every to hydrate 👍", flags: MessageFlags.Ephemeral });
    await channel.send("Did you know that 9 out of 10 gamers suffer from dehydration? Drink up gamers! 🥤");
  }
}
