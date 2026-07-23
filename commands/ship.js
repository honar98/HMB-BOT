const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('شایپ کردنی نێوان دوو کەس')
    .addUserOption(option => 
      option.setName('user1').setDescription('کەسی یەکەم').setRequired(true))
    .addUserOption(option => 
      option.setName('user2').setDescription('کەسی دووەم').setRequired(true)),
  
  async execute(interaction) {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');
    const random = Math.floor(Math.random() * 101);

    await interaction.reply(`❤️ ڕێژەی خۆشەویستی نێوان ${user1} و ${user2} بریتییە لە: **${random}%**`);
  },
};
