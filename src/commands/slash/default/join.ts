import { ApplicationCommandOptionType, ChannelType, GuildBasedChannel, GuildMember } from 'discord.js';
import { SlashCommand } from '../../../structures/Command';
import { client, logger } from '../../..';

export default new SlashCommand({
    name: 'join',
    description: 'Dołącza do kanału głosowego',
    dmPermission: false,
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
    run: async ({ interaction }) => {
        const member = interaction.member as GuildMember;

        const voiceChannel = interaction.options.getChannel('channel') as GuildBasedChannel || member.voice?.channel;

        if (!voiceChannel) return interaction.reply({ content: 'Nie jesteś na żadnym kanale głosowym, ani kanał do dołączenia nie został podany!', ephemeral: true, })
            .catch(err => logger.warn({ message: 'Could not replay', }));

        if(voiceChannel.type === ChannelType.GuildVoice) {
            if (!voiceChannel.joinable) return interaction.reply({ content: 'Nie mam uprawnień, aby dołączyć na ten kanał głosowy!' })
                .catch(err => logger.warn({ message: 'Could not replay', }));
            if (!voiceChannel.speakable) return interaction.reply({ content: 'Nie mam uprawnień, aby mówić na tym kanale głosowym!' })
                .catch(err => logger.warn({ message: 'Could not replay', }));

            client.distube.voices.join(voiceChannel).catch((err) => {
                logger.error({ err, message: 'Could not join voice channel' });
                return interaction.reply({ content: 'Coś poszło nie tak i nie udało mi się dołączyć na kanał głosowy!', ephemeral: true, })
                    .catch(err => logger.warn({ message: 'Could not replay', }));
            })
            .then(async () => {
                interaction.reply({ content: `Dołączono na <#${voiceChannel.id}>!\nTeraz możesz użyć </play:2137> aby dodać piosenkę`, })
                .catch(err => logger.warn({ message: 'Could not replay', }));
            });
        }
        else return interaction.reply({ content: 'Ten kanał nie jest kanałem głosowym.... nie mam pojęcia jakim cudem w ogóle został on wybrany' })
            .catch(err => logger.warn({ message: 'Could not replay', }));
    },
});