import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, InteractionReplyOptions, InteractionUpdateOptions, MessageActionRowComponent, SelectMenuBuilder } from 'discord.js';
import { RepeatMode } from 'distube';
import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';
import config from '../../config';
import { generateCustomId, songToDisplayString } from '../../utils';

export default new SlashCommand({
    data: {
        name: 'queue',
        description: 'Wyświetla kolejkę serwera',
        dmPermission: false,
    },
    run: async ({ interaction, logger }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error(err));;  

        let page = 0;
        
        const customIds = {
            next: generateCustomId('next', interaction),
            prev: generateCustomId('prev', interaction),
            first: generateCustomId('first', interaction),
            last: generateCustomId('last', interaction),
        }

        const update = (btnInteraction?: ButtonInteraction) => {
            const queue = distube.getQueue(interaction.guildId);
            if (!queue || !queue?.songs[0]) {
                if (btnInteraction)
                    return btnInteraction.update({ content: 'Kolejka już nie istnieje!', components: [], embeds: [], }).catch(err => logger.error(err));
                else return;
            }
            
            const SONGS_PER_PAGE = 8;
            const songs = Array.from(queue.songs);
            
            const pages = Math.ceil((songs.length - 1) / SONGS_PER_PAGE);

            if (page === -1) page = pages - 1;
            else if (page > pages) page = 0;

            const currentSong = `Teraz gra:\n${songToDisplayString(songs.shift())}\n\n`;
            const songsSliced = songs.slice((page * SONGS_PER_PAGE), (page * SONGS_PER_PAGE) + SONGS_PER_PAGE);

            const songsStringArr = songsSliced.map((song, index) => `${(index + (page * SONGS_PER_PAGE) + 1)}. ${songToDisplayString(song)}`);

            let pauseEmoji: string = queue.paused ? ' :pause_button:' : '';

            let loopEmoji: string;
            switch (queue.repeatMode) {
                case RepeatMode.DISABLED:
                    loopEmoji = '';
                    break;

                case RepeatMode.QUEUE:
                    loopEmoji = ' 🔁';
                    break;

                case RepeatMode.SONG:
                    loopEmoji = ' 🔂';
                    break;
            }

            const songsLeft = songs.length + 1;
            let piosenek: string, znajduje: string;
            if (songsLeft === 1) {
                piosenek = 'piosenka';
                znajduje = 'znajduje';
            }
            else if (1 < songsLeft && songsLeft < 5) {
                piosenek = 'piosenki';
                znajduje = 'znajdują';
            }
            else {
                piosenek = 'piosenek';
                znajduje = 'znajduje';
            }

            const content: InteractionReplyOptions | InteractionUpdateOptions = {
                embeds: [
                    {
                        title: `Kolejka${loopEmoji}${pauseEmoji}`,
                        description: `${page === 0 ? currentSong : ''}${songsStringArr.join('\n\n')}`,
                        color: config.embedColor,
                        footer: {
                            text: `Na kolejce ${znajduje} się ${songsLeft} ${piosenek}`,
                        },
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                customId: customIds.first,
                                label: '⇤',
                                style: ButtonStyle.Secondary,
                                disabled: page <= 0,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.prev,
                                label: '←',
                                style: ButtonStyle.Secondary,
                                disabled: page <= 0,
                            },
                            {
                                type: ComponentType.Button,
                                customId: `noid`,
                                label: `${page + 1}/${songsStringArr.length ? pages : '1'}`,
                                style: ButtonStyle.Secondary,
                                disabled: true,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.next,
                                label: '→',
                                style: ButtonStyle.Secondary,
                                disabled: page >= pages - 1,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.last,
                                label: '⇥',
                                style: ButtonStyle.Secondary,
                                disabled: page >= pages - 1,
                            },
                        ],
                    },
                ],
            }

            if (!btnInteraction) interaction.reply(content as InteractionReplyOptions)
                .catch(err => logger.error(err));
            else btnInteraction.update(content as InteractionUpdateOptions)
                .catch(err => logger.error(err));
        }
        update();

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, idle: 300_000 /*6 min*/ });

        collector.on('collect', btnInteraction => {
            if (btnInteraction.customId === customIds.next) page++;
            else if (btnInteraction.customId === customIds.prev) page--;
            else if (btnInteraction.customId === customIds.first) page=0;
            else if (btnInteraction.customId === customIds.last) page = -1;
            else return;

            update(btnInteraction);
        });

        collector.once('end', async () => {
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

    },
});
