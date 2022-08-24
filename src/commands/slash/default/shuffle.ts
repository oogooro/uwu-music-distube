import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'shuffle',
    description: 'Przetasuj piosenki',
    vcOnly: true,
    run: async ({ interaction, }) => {
        client.distube.shuffle(interaction.guildId)
            .then(() => {
                interaction.reply({ content: ':twisted_rightwards_arrows: Przetasowano piosenki!' })
                    .catch(err => logger.warn({ message: 'could not ' }));
            })
            .catch(err => {
                logger.error({ err, message: 'shufla sie wyjebala' });
                interaction.reply({ content: 'Nie udało się przetasować piosenek!' })
                    .catch(err => logger.warn({ message: 'could not ' }));
            });
    },
});