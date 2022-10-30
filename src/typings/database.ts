import { ActivitiesOptions } from 'discord.js';

export interface BotSettings {
    online: boolean;
    status: {
        visible: boolean;
        data: ActivitiesOptions[];
    };
    devs: string[];
}