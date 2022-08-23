import { client, logger } from '..';
import { Event } from '../structures/Event';
import { botSettingsDB } from '../structures/Database';
import { botSettings } from '../typings/database';
import { ActivityType } from 'discord.js';

export default new Event('ready', async () => {
    const { online, status, } = botSettingsDB.get('settings') as botSettings;

    if (!process.env.guildId) logger.warn({ message: 'ENVVAR guildId is not set. Not registering commands.', });
    else {
        client.guilds.fetch(process.env.guildId).then(guild => {
            client.registerCommands(client.commands.payload.allCommands, process.env.guildId, false)
                .catch(() => { });
        }).catch(err => {
            logger.warn({ message: 'Could not find bot\'s main guild. Not registering commands.', });
        });
    }

    logger.log({
        level: 'init',
        message: `Running in ${online ? 'Online' : 'Dev-only'} mode`,
        color: online ? 'green' : 'magentaBright',
    });

    client.user.setActivity({
        name: status.enabled ? status.text : '',
        type: ActivityType.Watching,
    });

    client.user.setStatus(online ? 'online' : 'dnd');

    logger.log({
        level: 'init',
        message: `Bot is ready, logged as ${client.user.tag}`,
        color: 'cyanBright',
    });
}, true);