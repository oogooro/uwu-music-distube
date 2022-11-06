import { APIEmbed, ApplicationCommandType, GuildMember } from 'discord.js';
import { logger, distube } from '../..';
import { MessageCommand } from '../../structures/MessageCommand';

const ytLinkRe = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/\S+/g

export default new MessageCommand({
    data: {
        name: 'Dodaj do kolejki',
        type: ApplicationCommandType.Message,
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction }) => {
        let matched = interaction.targetMessage.content.match(ytLinkRe);
        if (!matched) matched = interaction.targetMessage.embeds[0]?.url?.match(ytLinkRe);
        if (!matched) matched = interaction.targetMessage.embeds[0]?.description?.match(ytLinkRe);

        if (!matched) return interaction.reply({ content: 'W tej wiadomości nie ma linków do YouTube', ephemeral: true, })
            .catch(err => logger.error({ err, message: 'Could not reply', }));

        const [ link ] = matched;

        await interaction.deferReply().catch(err => logger.error({ err, message: 'Could not defer reply', }));

        distube.interactionShared.set(interaction.guildId, interaction);
        distube.errorChannel.set(interaction.guildId, interaction.channel);

        const member = interaction.member as GuildMember;
        distube.play(member.voice.channel, link, {
            member,
        }).catch(err => {
            logger.error({ err, message: 'bruh', });

            const content = err.message.toLowerCase().includes('nsfw') ? 'Nie udało się dodać piosenki, bo Youtube nie pozwala odtwarzać piosenek 18+ bez zalogowania się' : 'Coś poszło nie tak i nie można zagrać muzyki ||(skill issue distube)||';

            const embed: APIEmbed = {
                title: 'Wystąpił błąd!',
                color: 0xff0000,
                description: content,
            }

            return interaction.editReply({ embeds: [embed], })
                .catch(err => logger.error({ err, message: 'Could not edit reply', }));
        });
    },
});