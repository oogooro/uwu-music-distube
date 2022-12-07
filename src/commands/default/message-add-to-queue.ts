import { APIEmbed, ApplicationCommandType, GuildMember } from 'discord.js';
import { distube } from '../..';
import { MessageCommand } from '../../structures/MessageCommand';

const ytLinkRe = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/[^)\s]+/g

export default new MessageCommand({
    data: {
        name: 'Dodaj do kolejki',
        type: ApplicationCommandType.Message,
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        const member = interaction.member as GuildMember;
        const channel = member.voice?.channel;

        if (!channel.joinable) return interaction.reply({ content: 'Nie mam uprawnień, aby dołączyć na kanał, na którym jesteś!' })
            .catch(err => logger.error(err));
        if (!channel) return interaction.reply({ content: 'Nie mam uprawnień, aby mówić na kanale, na którym jesteś!' })
            .catch(err => logger.error(err));

        let matched = interaction.targetMessage.content.match(ytLinkRe);
        if (!matched) matched = interaction.targetMessage.embeds[0]?.url?.match(ytLinkRe);
        if (!matched) matched = interaction.targetMessage.embeds[0]?.description?.match(ytLinkRe);

        if (!matched) return interaction.reply({ content: 'W tej wiadomości nie ma linków do YouTube', ephemeral: true, })
            .catch(err => logger.error(err));

        const [ songUrl ] = matched;

        await interaction.deferReply().catch(err => logger.error(err));

        let sharedInteractions = distube.interactionShared.get(interaction.guildId);

        if (!sharedInteractions) sharedInteractions = [];

        sharedInteractions.push({ interaction });

        distube.interactionShared.set(interaction.guildId, sharedInteractions);
        distube.errorChannel.set(interaction.guildId, interaction.channel);

        distube.play(member.voice.channel, songUrl, {
            member,
        }).catch(err => {
            logger.error(err);

            let sharedInteractions = distube.interactionShared.get(interaction.guildId);

            if (sharedInteractions) {
                sharedInteractions.pop();
                distube.interactionShared.set(interaction.guildId, sharedInteractions);
            }

            const content = err.message.toLowerCase().includes('nsfw') ? 'Nie udało się dodać piosenki, bo Youtube nie pozwala odtwarzać piosenek 18+ bez zalogowania się' : 'Coś poszło nie tak i nie można zagrać muzyki';

            const embed: APIEmbed = {
                title: 'Wystąpił błąd!',
                color: 0xff0000,
                description: content,
            }

            return interaction.editReply({ embeds: [embed], })
                .catch(err => logger.error(err));
        });
    },
});