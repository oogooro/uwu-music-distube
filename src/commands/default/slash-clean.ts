import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'clean',
        description: 'Zatrzymuje i czyści kolejkę',
        dmPermission: false,
    },
    vcOnly: true,
    queueRequired: true,
    run: async ({ interaction, logger, queue }) => {
        queue.stop().catch(err => logger.error(err));

        interaction.reply({ content: 'Wyczyszczono całą kolejkę!' }).catch(err => logger.error(err));    
    },
});
