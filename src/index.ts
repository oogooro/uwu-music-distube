import { ExtendedClient } from './structures/Client';
import ExtendedDistube from './structures/Distube';
import config from './config';
import dotenv from 'dotenv';
import { Logger } from './structures/Logger';
dotenv.config();

export const logger = new Logger({});
export const client = new ExtendedClient(config.clientOptions);
export const distube = new ExtendedDistube(config.distubeOptions);

if (!process.env.ENV) {
    logger.log({
        level: 'error',
        message: 'ENVVAR ENV is not set! Aborting.',
    });
    process.exit(1);
}

logger.log({
    level: 'init',
    message: `Running on ${process.env.ENV}`,
    color: 'greenBright',
});

client.start();

import './server/server';
