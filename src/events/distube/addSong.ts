import { client, logger } from '../..';
import { DistubeEvent } from '../../structures/Event';

export default new DistubeEvent(
    'addSong',
    async (queue, song) => {
        const interaction = client.interactionShared.get(queue.id);

        interaction.editReply({
            embeds: [{
                description: `${song.name} - ${song.uploader.name}\n(dodane przez: <@${song.user.id}>)`,
                title: 'Dodano',
                color: 0x4d06b8,
            }],
        }).catch(err => {
            logger.warn({ message: 'Could not edit reply', });
        });
    }
);