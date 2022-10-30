import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import { client, distube, logger } from '../..';

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
    run: async ({ interaction }) => {
        const string = interaction.options.getString('song');
        const position = interaction.options.getBoolean('next') ? 1 : 0;
        const skip = interaction.options.getBoolean('skip');
        const shuffle = interaction.options.getBoolean('shuffle');

        await interaction.deferReply().catch(err => logger.warn({ message: 'Could not defer reply' }));

        distube.interactionShared.set(interaction.guildId, interaction);

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
            logger.error({ err, message: 'bruh', });
            return interaction.editReply({ content: 'Coś poszło nie tak i nie można zagrać muzyki', })
                .catch(() => logger.warn({ message: 'Could not reply', }));
        });
    },
});