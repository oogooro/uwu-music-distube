import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';
import config from '../../config';
import { formatTimeDisplay, generateCustomId, songToDisplayString, trimString } from '../../utils';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, SelectMenuBuilder } from 'discord.js';

export default new SlashCommand({
    data: {
        name: 'now-playing',
        description: 'Zobacz co aktualnie gra na serwerze',
        dmPermission: false,
    },
    queueRequired: true,
    run: async ({ interaction, logger, queue }) => {
        const [song] = queue?.songs;
        
        if (!queue?.playing) return interaction.reply({ content: 'Aktualnie nic nie gra!' + song ? '' : 'Wskocz na kanał głosowy i użyj </play:2137>, aby rozkręcić imprezę!' }).catch(err => logger.error(err));

        const PROGRESS_LENGHT: number = 40;
        const progress = Math.round(queue.currentTime / song.duration * PROGRESS_LENGHT);

        let progressString = '[';

        if (song.isLive) {
            const text = 'LIVESTREAM';

            for (let i = 0; i <= (PROGRESS_LENGHT - text.length) / 2; i++) {
                progressString += ' ';
            }
            progressString += text;
            for (let i = 0; i <= (PROGRESS_LENGHT - text.length) / 2; i++) {
                progressString += ' ';
            }
        } else {
            for (let i = 0; i <= PROGRESS_LENGHT; i++ ) {
                if (i < progress) progressString += '―';
                else if (i === progress) progressString += '๏';
                else progressString += ' ';
            }
        }

        progressString += ']';

        const songsLeft = queue.songs.length - 1;

        let pozostalo: string, piosenek: string;
        if (songsLeft === 1) {
            pozostalo = 'Pozostała';
            piosenek = 'inna piosenka';
        }
        else if (1 < songsLeft && songsLeft < 5) {
            pozostalo = 'Pozostały'
            piosenek = 'piosenki';
        }
        else {
            pozostalo = 'Pozostało'
            piosenek = 'piosenek';
        }

        const moreInfoCustomId = generateCustomId('moreinfonp', interaction);

        const collecor = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, filter: (btn => btn.customId === moreInfoCustomId), idle: 300_000 /* 5min */ });

        collecor.on('collect', btnInteraction => {
            btnInteraction.reply({
                embeds: [{
                    title: trimString(song.name, 80),
                    url: song.url,
                    color: config.embedColor,
                    fields: [
                        { name: 'Kanał', value: `[${song.uploader.name}](${song.uploader.url})`, },
                        { name: 'Wyświetlenia', value: Intl.NumberFormat('pl', { notation: 'compact', }).format(song.views), },
                    ],
                    thumbnail: {
                        url: song.thumbnail,
                    },
                }],
                ephemeral: true,
            });
        });

        collecor.once('end', async () => {
            const message = await interaction.fetchReply();

            const disabledRows = message.components.reduce((a: ActionRowBuilder<ButtonBuilder | SelectMenuBuilder>[], row) => {
                const components = row.toJSON().components.reduce((a: (ButtonBuilder | SelectMenuBuilder)[], component) => {
                    let builder: (ButtonBuilder | SelectMenuBuilder) = (component.type === ComponentType.Button) ? ButtonBuilder.from(component) : SelectMenuBuilder.from(component);
                    builder.setDisabled(true);
                    a.push(builder);
                    return a;
                }, []);
                const disabledRow = (components[0].data.type === ComponentType.Button) ?
                    new ActionRowBuilder<ButtonBuilder>().addComponents(components as ButtonBuilder[]) :
                    new ActionRowBuilder<SelectMenuBuilder>().addComponents(components as SelectMenuBuilder[]);
                a.push(disabledRow);
                return a;
            }, []);

            interaction.editReply({ components: disabledRows, })
                .catch(err => logger.error(err));
        });

        interaction.reply({
            embeds: [{
                title: 'Teraz gra',
                description: `${songToDisplayString(song)}\n\n\`${formatTimeDisplay(queue.currentTime)} / ${song.formattedDuration} ${progressString}\``,
                color: config.embedColor,
                footer: {
                    text: songsLeft === 0 ? `To jest ostatnia piosenka na kolejce` : `${pozostalo} jeszcze ${songsLeft} ${piosenek} na kolejce`,
                },
            }],
            components: [{
                type: ComponentType.ActionRow,
                components: [{
                    type: ComponentType.Button,
                    customId: moreInfoCustomId,
                    style: ButtonStyle.Secondary,
                    label: 'Więcej informacji',
                    emoji: '🔍',
                }],
            }],
        }).catch(err => logger.error(err));
    },
});