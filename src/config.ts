import { ClientOptions, IntentsBitField } from 'discord.js';
import { DisTubeOptions } from 'distube';
import { LoggerOptions } from './typings/logger';

interface Config {
    clientOptions: ClientOptions;
    distubeOptions: DisTubeOptions;
    logger: LoggerOptions;
    embedColor: number;
}

const intentFlags = IntentsBitField.Flags;

const config: Config = {
    clientOptions: {
        intents: [intentFlags.Guilds, intentFlags.GuildMembers, intentFlags.GuildVoiceStates],
    },
    distubeOptions: {
        searchSongs: 10,
        searchCooldown: 5,
        leaveOnEmpty: false,
    },
    logger: {
        disableWriteStreams: false,
    },
    embedColor: 9110954,
}

export default config;