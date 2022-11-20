import { ClientOptions, IntentsBitField, Partials } from 'discord.js';
import { LoggerOptions } from 'log4uwu';
import { DisTubeOptions } from 'distube';
import moment from 'moment';

interface Config {
    clientOptions: ClientOptions;
    distubeOptions: DisTubeOptions;
    loggerOptions: LoggerOptions;
    embedColor: number;
}

const intentFlags = IntentsBitField.Flags;

const config: Config = {
    clientOptions: {
        intents: [intentFlags.Guilds, intentFlags.GuildVoiceStates, intentFlags.GuildMessages],
        partials: [Partials.Message],
    },
    distubeOptions: {
        emptyCooldown: 300,
        leaveOnEmpty: true,
        leaveOnFinish: false,
        leaveOnStop: false,
    },
    loggerOptions: {
        transports: [
            `${__dirname}/../logs/${moment(new Date()).format('D-M-YY-HH-mm-ss')}-${process.env.ENV}.log`,
            `${__dirname}/../logs/latest-${process.env.ENV}.log`,
        ],
        debugMode: process.env.DEBUG_MODE === '1',
    },
    embedColor: 0x8b05aa,
}

export default config; 