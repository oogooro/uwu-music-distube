import { ButtonInteraction, ButtonStyle, ComponentType, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js';
import { RepeatMode } from 'distube';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';
import { embedColor } from '../../../config.json';

export default new SlashCommand({
    name: 'queue',
    description: 'Wyświetla kolejkę serwera',
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        let page = 0;
        
        const customIds = {
            next: client.utils.generateCustomId('next', interaction),
            prev: client.utils.generateCustomId('prev', interaction),
            first: client.utils.generateCustomId('first', interaction),
            last: client.utils.generateCustomId('last', interaction),
        }

        const update = (btnInteraction?: ButtonInteraction, disableButtons?: boolean) => {
            const queue = client.distube.getQueue(interaction.guildId);
            if (!queue || !queue?.songs[0]) {
                if (disableButtons) return interaction.deleteReply().catch(err => logger.error({ err, message: 'could not clean up after empty queue' }));
                else if (!btnInteraction)
                    return interaction.reply({ content: 'Kolejka już nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));
                else 
                    return btnInteraction.update({ content: 'Kolejka już nie istnieje!', components: [], embeds: [], }).catch(err => logger.warn({ message: 'could not cum' }));
            }
            
            const SONGS_PER_PAGE = 8;
            const songs = Array.from(queue.songs);
            
            const pages = Math.ceil((songs.length - 1) / SONGS_PER_PAGE);

            if (page === -1) page = pages - 1;

            const currentSong = `Teraz gra:\n${client.utils.distube.songToDisplayString(songs.shift())}\n\n`;
            const songsSliced = songs.slice((page * SONGS_PER_PAGE), (page * SONGS_PER_PAGE) + SONGS_PER_PAGE);

            const songsStringArr = songsSliced.map((song, index) => `${(index + (page * SONGS_PER_PAGE) + 1)}. ${client.utils.distube.songToDisplayString(song)}`);

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
                        color: embedColor,
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
                                disabled: disableButtons || page <= 0,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.prev,
                                label: '←',
                                style: ButtonStyle.Secondary,
                                disabled: disableButtons || page <= 0,
                            },
                            {
                                type: ComponentType.Button,
                                customId: `noid`,
                                label: `${page + 1}/${pages}`,
                                style: ButtonStyle.Secondary,
                                disabled: true,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.next,
                                label: '→',
                                style: ButtonStyle.Secondary,
                                disabled: disableButtons || page >= pages - 1,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.last,
                                label: '⇥',
                                style: ButtonStyle.Secondary,
                                disabled: disableButtons || page >= pages - 1,
                            },
                        ],
                    },
                ],
            }

            if (disableButtons) {
                interaction.editReply(content as InteractionReplyOptions)
                    .catch(err => logger.error({ message: 'Could edit reply', err, }));
            } else {
                if (!btnInteraction) interaction.reply(content as InteractionReplyOptions)
                    .catch(err => logger.error({ message: 'could not reply (update())', err, }));
                else btnInteraction.update(content as InteractionUpdateOptions)
                    .catch(err => logger.error({ message: 'Could not update button interaction', err, }));
            }

        }
        update();

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, idle: 600_000 /*10 min*/ });

        collector.on('collect', btnInteraction => {
            if (btnInteraction.customId === customIds.next) page++;
            else if (btnInteraction.customId === customIds.prev) page--;
            else if (btnInteraction.customId === customIds.first) page=0;
            else if (btnInteraction.customId === customIds.last) page = -1;
            else return;

            update(btnInteraction);
        });

        collector.once('end', () => {
            update(null, true);
        });
    },
});