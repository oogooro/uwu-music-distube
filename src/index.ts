import { ExtendedClient } from './structures/Client';
import { intents } from './config.json';
import dotenv from 'dotenv';
import { Logger } from './structures/Logger';
dotenv.config();

export const logger = new Logger({});
export const client = new ExtendedClient({ intents, });

if (process.env.environment) logger.log({
    level: 'init',
    message: `Running on ${process.env.environment}`,
    color: 'greenBright',
});
else logger.warn({ message: 'ENVVAR `environment` is not set', });

logger.debug({ message: `Client created`, });

client.start();