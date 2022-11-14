import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'shuffle',
        description: 'Przetasuj piosenki',
        dmPermission: false,
    },
    vcOnly: true,
    queueRequired: true,
    run: async ({ interaction, logger }) => {
        distube.shuffle(interaction.guildId)
            .then(() => {
                interaction.reply({ content: ':twisted_rightwards_arrows: Przetasowano piosenki!' })
                    .catch(err => logger.error(err));;  
            })
            .catch(err => {
                logger.error(err);
                interaction.reply({ content: 'Nie udało się przetasować piosenek!', ephemeral: true, })
                    .catch(err => logger.error(err));;  
            });
    },
});