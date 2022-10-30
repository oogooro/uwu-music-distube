import { client, logger } from '../..';
import { DjsClientEvent } from '../../structures/DjsClientEvent';
import { botSettingsDB } from '../../structures/Database';
import { BotSettings } from '../../typings/database';
import { io } from '../../server/server';

export default new DjsClientEvent('ready', async () => {
    const { online, } = botSettingsDB.get('settings') as BotSettings;

    if (!process.env.BOT_GUILD_ID) logger.warn({ message: 'ENVVAR BOT_GUILD_ID is not set.', });

    logger.log({
        level: 'init',
        message: `Running in ${online ? 'Online' : 'Dev-only'} mode`,
        color: online ? 'green' : 'magentaBright',
    });

    client.updatePresence();

    logger.log({
        level: 'init',
        message: `Bot is ready, logged as ${client.user.tag}`,
        color: 'cyanBright',
    });

    io.emit('botReady');
}, true);