import { client, distube, logger } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'shuffle',
        description: 'Przetasuj piosenki',
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, }) => {
        distube.shuffle(interaction.guildId)
            .then(() => {
                interaction.reply({ content: ':twisted_rightwards_arrows: Przetasowano piosenki!' })
                    .catch(err => logger.error({ err, message: 'could not reply' }));  
            })
            .catch(err => {
                logger.error({ err, message: 'shufla sie wyjebala' });
                interaction.reply({ content: 'Nie udało się przetasować piosenek!', ephemeral: true, })
                    .catch(err => logger.error({ err, message: 'could not reply' }));  
            });
    },
});