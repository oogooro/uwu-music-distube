import { ActivityType } from 'discord.js';
import Enmap from 'enmap';
import { logger } from '..';
import { BotSettings } from '../typings/database';

export const botSettingsDB: Enmap<string, BotSettings> = new Enmap({ name: 'botSettings', });
export const guildsDB: Enmap<string, any> = new Enmap({ name: 'guilds', });

if (!botSettingsDB.get('settings')) {
    logger.log({
        level: 'info',
        message: 'Generating new bot settings',
        color: 'magentaBright',
    });

    botSettingsDB.set('settings', {
        online: true,
        status: {
            visible: true,
            data: [{
                name: 'Anime',
                type: ActivityType.Watching,
            }],
        },
        devs: ['299533808359833600'],
    });
}