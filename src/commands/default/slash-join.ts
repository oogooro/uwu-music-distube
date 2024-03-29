import { ApplicationCommandOptionType, ChannelType, GuildMember, VoiceChannel } from 'discord.js';
import { SlashCommand } from '../../structures/SlashCommand';
import { client, distube } from '../..';

export default new SlashCommand({
    data: {
        name: 'join',
        description: 'Dołącza do kanału głosowego',
        options: [
            {
                type: ApplicationCommandOptionType.Channel,
                name: 'channel',
                nameLocalizations: {
                    pl: 'kanał'
                },
                description: 'Voice channel to join',
                descriptionLocalizations: {
                    pl: 'Kanał do dołączenia'
                },
                channel_types: [
                    ChannelType.GuildVoice,
                ]
            },
        ],
        dmPermission: false,
    },
    run: async ({ interaction, logger }) => {
        const member = interaction.member as GuildMember;

        const voiceChannel = interaction.options.getChannel('channel') as VoiceChannel;
        const memberVoiceChannel = member.voice?.channel;

        const channel = voiceChannel || memberVoiceChannel;

        if (!channel)
            return interaction.reply({ content: 'Nie jesteś na żadnym kanale głosowym, ani kanał do dołączenia nie został podany!', ephemeral: true, })
                .catch(err => logger.error(err));  

        if (channel.type === ChannelType.GuildVoice) {
            if (!channel.joinable) return interaction.reply({ content: 'Nie mam uprawnień, aby dołączyć na ten kanał głosowy!' })
                .catch(err => logger.error(err));  
            if (!channel) return interaction.reply({ content: 'Nie mam uprawnień, aby mówić na tym kanale głosowym!' })
                .catch(err => logger.error(err));  

            distube.voices.join(channel).catch((err) => {
                logger.error(err);
                return interaction.reply({ content: 'Coś poszło nie tak i nie udało mi się dołączyć na kanał głosowy!', ephemeral: true, })
                    .catch(err => logger.error(err));
            })
            .then(async () => {
                interaction.reply({ content: `Dołączono na <#${channel.id}>!\nWbij na kanał głosowy i użyj </play:2137>, aby dodać piosenkę`, })
                .catch(err => logger.error(err));
            });
        }
        else return interaction.reply({ content: 'Na wybranym kanale nie można używać bota', ephemeral: true, })
            .catch(err => logger.error(err));
    },
});