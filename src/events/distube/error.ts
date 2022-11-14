import { logger } from '../..';
import { DistubeEvent } from '../../structures/DistubeEvent';

export default new DistubeEvent(
    'error',
    async (channel, err: Error/*skill issue*/) => {
        logger.error(err);
    }
);