import { logger } from '../..';
import { DistubeEvent } from '../../structures/DistubeEvent';

export default new DistubeEvent(
    'error',
    async (channel, err: any/*skill issue*/) => {
        logger.error({
            err,
            message: 'Distube kurwa error',
        });
    }
);