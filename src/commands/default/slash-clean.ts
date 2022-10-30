import { client, distube, logger } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'clean',
        description: 'Czyszczenie kolejki ze wszystkich piosenek',
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        queue.songs = [queue.songs[0]];

        interaction.reply({ content: 'Wyczyszczono całą kolejkę!' }).catch(err => logger.warn({ message: 'could not reply' }));      
    },
});
