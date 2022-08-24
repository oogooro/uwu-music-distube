import { ApplicationCommandOptionType } from 'discord.js';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'skip',
    description: 'Pomiń piosenkę',
    vcOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'number',
            nameLocalizations: {
                pl: 'numer',
            },
            description: 'Numer do jakiej piosenki pominąć',
        },
    ],
    run: async ({ interaction, }) => {
        const num = interaction.options.getInteger('number');

        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));

        if (!num) {
            client.distube.skip(interaction.guildId)
                .then(() => {
                    interaction.reply({ content: ':track_next: Pominięto piosenkę!' })
                        .catch(err => logger.warn({ message: 'could not ' }));
                })
                .catch(err => {
                    logger.error({ err, message: 'skip sie wyjebal idk' });
                    interaction.reply({ content: 'Nie udało się pominąć piosenki!' })
                        .catch(err => logger.warn({ message: 'could not ' }));
                });
        } else {
            if (num < 1 || num) return interaction.reply({ content: 'Piosenka z takim numerem nie może istnieć', }).catch(err => logger.warn({ message: 'could not reply' }));
            if (num > queue.songs.length) return interaction.reply({ content: 'Nie ma piosenki z takim numerem na kolejce', }).catch(err => logger.warn({ message: 'could not reply' }));

            client.distube.jump(interaction.guildId, num).then((song) => {
                interaction.reply({ content: `:track_next: Pominięto do \`${song.name}\`!` })
                    .catch(err => logger.warn({ message: 'could not ' }));
            })
            .catch(err => {
                logger.error({ err, message: 'sadge kolejny wysyp', });
                interaction.reply({ content: `Nie udało się pominąć piosenek!` })
                    .catch(err => logger.warn({ message: 'could not ' }));
            });
        }
    },
});