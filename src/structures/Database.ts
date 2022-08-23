import Enmap from 'enmap';
import { logger } from '..';

export const botSettingsDB = new Enmap({ name: 'botSettings', });
export const guildsDB = new Enmap({ name: 'guilds', });
export const customUserRolesDB = new Enmap({ name: 'customUserRoles', });

if (!botSettingsDB.get('settings')) {
    logger.log({
        level: 'info',
        message: 'Generating new bot settings',
        color: 'magentaBright',
    });

    botSettingsDB.set('settings', {
        online: true,
        status: {
            enabled: true,
            text: 'anime',
        },
        devs: ['299533808359833600'],
    });
}