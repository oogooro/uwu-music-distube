import { ExtendedClient } from './structures/Client';
import config from './config';
import dotenv from 'dotenv';
import { Logger } from './structures/Logger';
dotenv.config();

export const logger = new Logger({});
export const client = new ExtendedClient(config.clientOptions);

if (process.env.ENV) logger.log({
    level: 'init',
    message: `Running on ${process.env.ENV}`,
    color: 'greenBright',
});
else logger.warn({ message: 'ENVVAR ENV is not set', });

logger.debug({ message: `Client created`, });

client.start();