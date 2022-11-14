import { ApplicationCommandOptionType } from 'discord.js';
import { RepeatMode } from 'distube';
import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'skip',
        description: 'Pomiń piosenkę',
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: 'to',
                nameLocalizations: {
                    pl: 'do',
                },
                description: 'Numer do jakiej piosenki pominąć',
            },
        ],
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        const num = interaction.options.getInteger('to');

        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error(err));;  

        if (!num) {
            if (!queue.songs[1]) {
                distube.stop(interaction.guildId).then(() => {
                    interaction.reply({ content: ':track_next: Pominięto piosenkę! To była ostatnia piosenka!' })
                        .catch(err => logger.error(err));;  
                })
                    .catch(err => {
                        logger.error(err);
                        interaction.reply({ content: 'Nie udało się pominąć piosenki!', ephemeral: true, })
                            .catch(err => logger.error(err));;  
                    });
            }
            else {
                distube.skip(interaction.guildId)
                    .then(() => {
                        interaction.reply({ content: ':track_next: Pominięto piosenkę!' })
                            .catch(err => logger.error(err));;  
                    })
                    .catch(err => {
                        logger.error(err);
                        interaction.reply({ content: 'Nie udało się pominąć piosenki!', ephemeral: true, })
                            .catch(err => logger.error(err));;  
                    });
            }
        } else {
            if (num < 1) return interaction.reply({ content: 'Piosenka z takim numerem nie może istnieć', ephemeral: true, }).catch(err => logger.error(err));;  
            if (num > queue.songs.length) return interaction.reply({ content: 'Nie ma piosenki z takim numerem na kolejce', ephemeral: true, }).catch(err => logger.error(err));;  

            if (queue.repeatMode === RepeatMode.QUEUE) queue.songs = queue.songs.concat(queue.songs.slice(0, num - 1));

            distube.jump(interaction.guildId, num).then((song) => {
                interaction.reply({ content: `:track_next: Pominięto do \`${song.name}\`!` })
                    .catch(err => logger.error(err));;  
            })
            .catch(err => {
                logger.error(err);
                interaction.reply({ content: `Nie udało się pominąć piosenek!`, ephemeral: true, })
                    .catch(err => logger.error(err));;  
            });
        }
    },
});