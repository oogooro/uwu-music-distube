import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';
import { botSettingsDB } from '../../../structures/Database';
import { botSettings } from '../../../typings/database';
import { ActivityType, ApplicationCommandOptionChoiceData, ApplicationCommandOptionType } from 'discord.js';

type ChangedValues = {
    value: string,
    to: string,
}

export default new SlashCommand({
    name: 'manage',
    description: '[DEV] Opcje bota',
    dev: true,
    options: [
        {
            name: 'dostępność',
            description: '[DEV] Opcje dostępności',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'online',
                    description: 'Kto może używać bota',
                    type: ApplicationCommandOptionType.Boolean,
                    required: true,
                },
            ],
        },
        {
            name: 'status',
            description: '[DEV] Opcje statusu',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'tekst',
                    description: 'Jaki status ma mieć bot',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'widoczny',
                    description: 'Czy status bota ma być wiczoczny',
                    type: ApplicationCommandOptionType.Boolean,
                },
            ],
        },
        {
            name: 'developerzy',
            description: '[DEV] Zarządzenie devami',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'dodaj',
                    description: 'Jakie ID dodać',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'usuń',
                    description: 'Jakie ID usunąć',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                },
            ],
        },
    ],
    run: async ({ interaction, }) => {
        const config = botSettingsDB.get('settings') as botSettings;
        let whatChanged: ChangedValues[] = [];

        if (interaction.options.get('online')) {
            config.online = interaction.options.get('online').value as boolean;
            client.user.setStatus(config.online ? 'online' : 'dnd');
            whatChanged.push({ value: 'Dostępność (online)', to: config.online ? 'True' : 'False', });
        }
        else if (interaction.options.get('tekst')) {
            config.status.text = interaction.options.get('tekst').value as string;
            client.user.setPresence({
                activities: [
                    {
                        name: config.status.text,
                        type: ActivityType.Watching,
                    },
                ],
            });
            whatChanged.push({ value: 'Tekst statusu', to: config.status.text, });
        }
        else if (interaction.options.get('widoczny')) {
            config.status.enabled = interaction.options.get('widoczny').value as boolean;
            if (config.status.enabled) {
                client.user.setPresence({
                    activities: [
                        {
                            name: config.status.text,
                            type: ActivityType.Watching,
                        },
                    ],
                });
            } else {
                client.user.setPresence({
                    activities: [],
                });
            }
            whatChanged.push({ value: 'Widoczność statusu', to: config.status.enabled ? 'True' : 'False', });
        }
        else if (interaction.options.get('dodaj')) {
            const id = interaction.options.get('dodaj').value as string;
            config.devs.push(id);
            whatChanged.push({ value: 'Developerzy', to: `Dodano ${id}`, });
        }
        else if (interaction.options.get('usuń')) {
            const id = interaction.options.get('usuń').value as string;
            const index = config.devs.indexOf(id); // thanks https://stackoverflow.com/a/5767357
            if (index > -1) config.devs.splice(index, 1);
            whatChanged.push({ value: 'Developerzy', to: `Usunięto ${id}`, });
        }
        else {
            return interaction.reply({ content: 'Nie podano ważnych informacji, aby wykonać tę komendę!', ephemeral: true, });
        }

        logger.debug({
            message: `Writing this to database: ${JSON.stringify(config, null, 2)}`,
            silent: true,
        });

        botSettingsDB.set('settings', config);

        let content = '**Zmieniono:**';

        whatChanged.forEach(element => {
            content += `\n> ${element.value} => \`${element.to}\``;
        });

        interaction.reply({ content, ephemeral: true, })
            .catch(err => { logger.warn({ message: 'Could not reply', silent: true, }) });
    },
    getAutocompletes: async ({ interaction, }) => {
        const { devs, } = botSettingsDB.get('settings') as botSettings;
        const devAutocompleted: ApplicationCommandOptionChoiceData[] = [];
        devs.forEach(dev => devAutocompleted.push({ name: `${client.users.cache.get(dev)?.username || 'Nie znaleziono nazwy'} (${dev})`, value: dev, }));
        interaction.respond(devAutocompleted);
    },
});