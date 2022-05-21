const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../dbSim.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("comportamento")
    .setDescription("Verifique o comportamento de um usuário!")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Digite o ID do usuário")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("mostrar")
        .setDescription("Mostra a lista de palavras proibidas.")
    ),
  async execute(interaction) {
    const action = await interaction;
    const id = action.options.getString("id");
    const bool = action.options.getBoolean("mostrar");
    if (users[id]) {
      let wordsNumber = Object.values(users[id]["badWords"]);
      if (wordsNumber[0]) {
        wordsNumber = wordsNumber.reduce((i, j) => {
          return i + j;
        }, 0);
      } else {
        wordsNumber = 0;
      }
      let color;
      const embed = new MessageEmbed()
        .setThumbnail(users[id].img)
        .setAuthor(users[id].name)
        .setDescription(
          wordsNumber < 10
            ? (() => {
                color = "#ffffff";
                return "Usuário comportado. Parabéns! :) \n O número de palavras ofensivas ditas é: **Abaixo de 10!**";
              })()
            : wordsNumber < 50
            ? (() => {
                color = "#facc41";
                return "Opa! Percebemos um número um pouco frequente de palavras ofensivas ditas nos canais livres, vamos maneirar!";
              })()
            : (() => {
                color = "#f00000";
                return "Você parecer ter um comportamento um pouco excessivo... Caso haja denúncias, o seu histórico poderá influenciar na sua punição.";
              })()
        );
      embed.setColor(color);
      if (bool) {
        let list = Object.entries(users[id].badWords),
          words = "";
        if (list[0]) {
          for (item of list) {
            words += item[0] + ": " + item[1] + "\n";
          }
        } else {
          words = "No words!";
        }
        embed.addFields({
          name: "Lista de Palavras:",
          value: words,
        });
        action.reply({ embeds: [embed] });
      } else {
        action.reply({ embeds: [embed] });
      }
    } else {
      action.reply({
        content: "Nenhum usuário com este ID!",
        ephemeral: true,
      });
    }
  },
};
