import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'clean',
    description: 'Czyszczenie kolejki ze wszystkich piosenek',
    vcOnly: true,
    dmPermission: false,
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        queue.songs = [queue.songs[0]];

        interaction.reply({ content: 'Wyczyszczono całą kolejkę!' }).catch(err => logger.warn({ message: 'could not reply' }));      
    },
});
