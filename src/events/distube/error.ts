import { client, logger } from '../..';
import { DistubeEvent } from '../../structures/Event';

export default new DistubeEvent(
    'error',
    async (channel, error) => {
        channel.send(error.name);
        console.log(error);
    }
);