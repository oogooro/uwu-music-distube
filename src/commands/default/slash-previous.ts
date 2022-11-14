import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'previous',
        description: 'Gra poprzednią piosenkę',
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        distube.previous(interaction.guildId).then(() => {})
        .catch(err => {
            logger.error(err);
            interaction.reply({ content: 'Nie udało się cofnąć piosenki', ephemeral: true, })
                .catch(err => logger.error(err));;  
        });

        interaction.reply({ content: `:track_previous: Cofnięto!` })
            .catch(err => logger.error(err));;  
    },
});