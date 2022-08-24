import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { SlashCommand } from '../../../structures/Command';
import { client, logger } from '../../..';

export default new SlashCommand({
    name: 'play',
    description: 'Gra podaną muzykę z youtube',
    vcOnly: true,
    options: [
        {
            name: 'song',
            nameLocalizations: {
                pl: 'piosenka',
            },
            description: 'Nazwa/link/playlista z youtube',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'next',
            nameLocalizations: {
                pl: 'następna',
            },
            description: 'Czy dodać tę piosenkę jako następną w kolejce',
            type: ApplicationCommandOptionType.Boolean,
        }
    ],
    run: async ({ interaction }) => {
        const string = interaction.options.getString('song');
        const position = interaction.options.getBoolean('next') ? 1 : 0;

        await interaction.deferReply().catch(err => logger.warn({ message: 'Could not defer reply' }));

        client.interactionShared.set(interaction.guildId, interaction);

        const member = interaction.member as GuildMember;
        client.distube.play(member.voice.channel, string, {
            member,
            position,
            textChannel: interaction.channel,
        })
        .catch(err => {
            logger.error({ err, message: 'bruh', });
            return interaction.editReply({ content: 'Coś poszło nie tak i nie można zagrać muzyki', })
                .catch(() => logger.warn({ message: 'Could not reply', }));
        });
    },
});
