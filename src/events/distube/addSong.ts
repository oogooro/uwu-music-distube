import { client, logger } from '../..';
import { DistubeEvent } from '../../structures/Event';
import config from '../../config';
import { distube } from '../../utils';

export default new DistubeEvent(
    'addSong',
    async (queue, song) => {
        const interaction = client.interactionShared.get(queue.id);

        interaction.editReply({
            embeds: [{
                title: 'Dodano',
                thumbnail: {
                    url: song.thumbnail,
                },
                description: distube.songToDisplayString(song),
                color: config.embedColor,
            }],
        }).catch(err => {
            logger.warn({ message: 'Could not edit reply', });
        });
    }
);