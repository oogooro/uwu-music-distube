import { client, distube, logger } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'clean',
        description: 'Zatrzymuje i czyści kolejkę',
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error({ err, message: 'could not reply' }));  

        queue.stop().catch(err => logger.error({ err, message: 'could not stop' }));

        interaction.reply({ content: 'Wyczyszczono całą kolejkę!' }).catch(err => logger.error({ err, message: 'could not reply' }));      
    },
});
