import { ClientOptions, IntentsBitField } from 'discord.js';
import { LoggerOptions } from './typings/logger';

interface Config {
    clientOptions: ClientOptions;
    logger: LoggerOptions;
    embedColor: number;
}

const intentFlags = IntentsBitField.Flags;

const config: Config = {
    clientOptions: {
        intents: [intentFlags.Guilds, intentFlags.GuildMembers, intentFlags.GuildVoiceStates],
    },
    logger: {
        disableWriteStreams: false,
    },
    embedColor: 9110954,
}

export default config;