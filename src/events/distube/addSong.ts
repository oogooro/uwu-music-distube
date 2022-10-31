import { client, distube, logger } from '../..';
import config from '../../config';
import { DistubeEvent } from '../../structures/DistubeEvent';
import { songToDisplayString } from '../../utils';


export default new DistubeEvent(
    'addSong',
    async (queue, song) => {
        const interaction = distube.interactionShared.get(queue.id);
        distube.interactionShared.delete(queue.id);

        interaction.editReply({
            embeds: [{
                title: 'Dodano',
                thumbnail: {
                    url: song.thumbnail,
                },
                description: songToDisplayString(song),
                color: config.embedColor,
            }],
        }).catch(err => logger.error({ err, message: 'Could not edit reply', }));
    }
);