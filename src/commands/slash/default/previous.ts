import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'previous',
    description: 'Gra poprzednią piosenkę',
    vcOnly: true,
    run: async ({ interaction, }) => {
        client.distube.previous(interaction.guildId).then(() => {})
        .catch(err => {
            logger.error({err, message: 'could not wsteczny', });
            interaction.reply({ content: 'Nie udało się cofnąć piosenki', })
                .catch(err => logger.warn({ message: 'could no' }));
        });

        interaction.reply({ content: `:track_previous: Cofnięto!` })
            .catch(err => logger.warn({ message: 'could not just not' }));
    },
});