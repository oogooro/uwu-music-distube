import { APIEmbed, ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import { client, distube } from '../..';

export default new SlashCommand({
    data: {
        name: 'play',
        description: 'Gra podaną muzykę z youtube',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'song',
                nameLocalizations: {
                    pl: 'piosenka',
                },
                description: 'Nazwa/link/playlista z youtube',
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'next',
                nameLocalizations: {
                    pl: 'następna',
                },
                description: 'Czy dodać tę piosenkę jako następną w kolejce',
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'skip',
                nameLocalizations: {
                    pl: 'pominąć',
                },
                description: 'Czy pominąć aktualną piosenkę',
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'shuffle',
                nameLocalizations: {
                    pl: 'przetasować',
                },
                description: 'Czy przetasować piosenki po dodaniu',
            },
        ],
        dmPermission: false,
},
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        const string = interaction.options.getString('song');
        const position = interaction.options.getBoolean('next') ? 1 : 0;
        const skip = interaction.options.getBoolean('skip');
        const shuffle = interaction.options.getBoolean('shuffle');

        await interaction.deferReply().catch(err => logger.error(err));

        distube.interactionShared.set(interaction.guildId, interaction);
        distube.errorChannel.set(interaction.guildId, interaction.channel);

        const member = interaction.member as GuildMember;
        distube.play(member.voice.channel, string, {
            member,
            position,
        })
        .then(() => {
            if (skip) {
                const queue = distube.getQueue(interaction.guildId);
                if (!queue || !queue.songs[1]) return;
                distube.skip(interaction.guildId);
            }
            if (shuffle) {
                const queue = distube.getQueue(interaction.guildId);
                if (!queue || !queue.songs[1]) return;
                distube.shuffle(interaction.guildId);
            }
        })
        .catch(err => {
            logger.error(err);

            const content = err.message.toLowerCase().includes('nsfw') ? 'Nie udało się dodać piosenki, bo Youtube nie pozwala odtwarzać piosenek 18+ bez zalogowania się' : 'Coś poszło nie tak i nie można zagrać muzyki ||(skill issue distube)||';
            
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
