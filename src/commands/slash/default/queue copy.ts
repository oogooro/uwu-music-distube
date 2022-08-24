import { ButtonInteraction, ButtonStyle, ComponentType, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js';
import { RepeatMode, Song } from 'distube';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

function songToStringDisplay(song: Song): string {
    return `${song.name} - ${song.uploader.name}\n(dodane przez <@${song.user.id}>)`;
}

export default new SlashCommand({
    disabled: true,
    name: 'queue',
    description: 'Wyświetla kolejkę serwera',
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));

        const { songs } = queue;

        const pages: string[] = [];
        const SONGS_PER_PAGE = 7;
        let stage = 0;

        for (let i = 0; i < Math.ceil((songs.length - 1)/SONGS_PER_PAGE); i++) {
            pages[i] = '';
            for (let k = 1; k <= SONGS_PER_PAGE; k++ ) {
                const songIndex = k + (i * SONGS_PER_PAGE);
                if (songIndex === 0) continue;
                else {
                    const song = songs[songIndex];
                    if (!song) break;
                    pages[i] += `${songIndex}. ${songToStringDisplay(song)}\n\n`;
                }
            }
        }

        const customIds = {
            next: client.utils.generateCustomId('next', interaction),
            prev: client.utils.generateCustomId('prev', interaction),
        }

        const update = (stage: number, btnInteraction?: ButtonInteraction) => {
            let loopEmoji: string;
            switch (queue.repeatMode) {
                case RepeatMode.DISABLED:
                    loopEmoji = '';
                    break;

                case RepeatMode.QUEUE:
                    loopEmoji = '🔁';
                    break;

                case RepeatMode.SONG:
                    loopEmoji = '🔂';
                    break;
            }
            
            const page = pages[stage];

            const content: InteractionReplyOptions | InteractionUpdateOptions = {
                embeds: [
                    {
                        title: `Kolejka ${loopEmoji}`,
                        description: `Teraz gra:\n${songToStringDisplay(songs[0])}\n\n${page}`,
                        color: 0x4d06b8,
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                customId: customIds.prev,
                                label: '⏪',
                                style: ButtonStyle.Secondary,
                                disabled: stage === 0,
                            },
                            {
                                type: ComponentType.Button,
                                customId: `noid`,
                                label: `${stage + 1}/${pages.length}`,
                                style: ButtonStyle.Secondary,
                                disabled: true,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.next,
                                label: '⏩',
                                style: ButtonStyle.Secondary,
                                disabled: stage === pages.length - 1,
                            },
                        ],
                    },
                ],
            }

            if (!btnInteraction) interaction.reply(content as InteractionReplyOptions)
                .catch(err => logger.error({ message: 'Could not reply', err, }));
            else btnInteraction.update(content as InteractionUpdateOptions)
                .catch(err => logger.error({ message: 'Could not reply', err, }));
        }
        update(0);

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, idle: 300000 /*5 min*/ });

        collector.on('collect', btnInteraction => {
            if (btnInteraction.customId === customIds.next) stage++;
            else if (btnInteraction.customId === customIds.prev) stage--;
            else return;

            update(stage, btnInteraction);
        });

        collector.once('end', () => {
        });
    },
});