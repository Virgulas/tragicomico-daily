const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { channelIds, roleIds } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diario")
    .setDescription("Divulgue um acontecimento!!")
    .addStringOption((option) =>
      option
        .setName("título")
        .setDescription("Escreva seu título!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("descrição")
        .setDescription("Descreva sua notícia.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("imagem")
        .setDescription("Url de uma imagem.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("autor").setDescription("Declare o autor do conteúdo.")
    )
    .addStringOption((option) =>
      option.setName("subtitulo").setDescription("Adicione um subtitulo.")
    )
    .addStringOption((option) =>
      option
        .setName("subdescrição")
        .setDescription("Adicione uma descrição ao subtitulo.")
    )
    .addStringOption((option) =>
      option.setName("fonte").setDescription("Adicione uma fonte a notícia.")
    )
    .addStringOption((option) =>
      option.setName("cor").setDescription("Escolha uma cor para a exibição.")
    ),
  async execute(interaction) {
    const action = await interaction;
    try {
      let url = new URL(action.options.getString("imagem"));
      let autor = "";
      if (action.options.getString("autor")) {
        autor = " - Autor: " + action.options.getString("autor");
      }

      const exampleEmbed = new MessageEmbed()
        .setColor("#b80000")
        .setTitle(action.options.getString("título"))
        .setDescription(action.options.getString("descrição"))
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/844699066930954302/968664576013004861/Tragi.png"
        )
        .setImage(action.options.getString("imagem"))
        .setTimestamp()
        .setFooter({
          text: "Publicado por: " + action.user.username + autor,
          iconURL: action.user.avatarURL(),
        });

      let subtitulo = action.options.getString("subtitulo"),
        subdescrição = action.options.getString("subdescrição");
      let fonte = action.options.getString("fonte"),
        cor = action.options.getString("cor");

      if (fonte) {
        let url2 = new URL(fonte);
        exampleEmbed.setURL(fonte);
      }

      if (cor) {
        let cores = {
          vermelho: "#ed0000",
          laranja: "#ff8000",
          amarelo: "#fff200",
          verde: "#48ff00",
          azul: "#005eff",
          roxo: "#a600ed",
          rosa: "#ff00f7",
          branco: "#ffffff",
          preto: "#000000",
        };
        if (cores[cor]) {
          exampleEmbed.setColor(cores[cor]);
        }
      }

      if (subtitulo) {
        let field = { name: subtitulo, value: "-" };
        if (subdescrição) field["value"] = subdescrição;
        exampleEmbed.addFields(field);
      }

      if (interaction.member.roles.cache.get(roleIds[0])) {
        action.client.channels.cache
          .find((channel) => channel.id == channelIds[0])
          .send({ embeds: [exampleEmbed] });
        action.reply({
          content: "Sua notícia foi publicada!",
          ephemeral: false,
        });
        action.deleteReply();
      } else {
        action.client.channels.cache
          .find((channel) => channel.id == channelIds[0])
          .send({ embeds: [exampleEmbed] });
        action.reply({
          content: "Sua notícia foi publicada!",
          ephemeral: false,
        });
        action.deleteReply();
      }
    } catch (error) {
      action.reply({
        content: "URL inválido. Tente novamente!",
        ephemeral: true,
      });
    }
  },
};
