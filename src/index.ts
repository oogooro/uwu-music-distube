import { ExtendedClient } from './structures/Client';
import ExtendedDistube from './structures/Distube';
import config from './config';
import dotenv from 'dotenv';
import { Logger } from './structures/Logger';
dotenv.config();

export const logger = new Logger({});
export const client = new ExtendedClient(config.clientOptions);
export const distube = new ExtendedDistube(config.distubeOptions);

if (process.env.ENV) logger.log({
    level: 'init',
    message: `Running on ${process.env.ENV}`,
    color: 'greenBright',
});
else logger.warn({ message: 'ENVVAR ENV is not set', });

logger.debug({ message: `Client created`, });

client.start();

import './server/server';
