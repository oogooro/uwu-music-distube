import { client, distube } from '../..';
import config from '../../config';
import { SlashCommand } from '../../structures/SlashCommand';
import { songToDisplayString } from '../../utils';

export default new SlashCommand({
    data: {
        name: 'previous',
        description: 'Gra poprzednią piosenkę',
        dmPermission: false,
    },
    vcOnly: true,
    queueRequired: true,
    run: async ({ interaction, logger }) => {
        distube.previous(interaction.guildId)
            .then(song => {
                interaction.reply({ embeds: [{
                    title: 'Cofnięto piosenkę',
                    description: `Cofnięto do ${songToDisplayString(song)}`,
                    color: config.embedColor,
                }], })
                    .catch(err => logger.error(err));;  
            })
            .catch(err => {
                logger.error(err);
                interaction.reply({ content: 'Nie udało się cofnąć piosenki', ephemeral: true, })
                    .catch(err => logger.error(err));;  
            });

    },
});