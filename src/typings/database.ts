import { Collection } from 'discord.js';

export interface botSettings {
    online: boolean;
    status: {
        enabled: boolean;
        text: string;
    };
    devs: string[];
}

export type CustomUserRoleInfo = Collection<string, string>;