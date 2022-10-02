import { logger } from '../..';
import { DistubeEvent } from '../../structures/Event';

export default new DistubeEvent(
    'error',
    async (channel, error) => {
        logger.error({ err: error, message: 'Distube Error', });
        channel.send(error.name)
            .catch(err => logger.error({ err, message: 'Could not send message', }));
    }
);