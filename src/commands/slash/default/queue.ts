import { ButtonInteraction, ButtonStyle, ComponentType, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js';
import { RepeatMode, Song } from 'distube';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

function songToStringDisplay(song: Song): string {
    return `${song.name} - ${song.uploader.name}\n(dodane przez <@${song.user.id}>)`;
}

export default new SlashCommand({
    name: 'queue',
    description: 'Wyświetla kolejkę serwera',
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));

        const SONGS_PER_PAGE = 4;
        let stage = 0;

        const customIds = {
            next: client.utils.generateCustomId('next', interaction),
            prev: client.utils.generateCustomId('prev', interaction),
        }

        const update = (stage: number, btnInteraction?: ButtonInteraction) => {
            const queue = client.distube.getQueue(interaction.guildId);
            if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));

            const songs = Array.from(queue.songs);
            
            const pages = Math.ceil((songs.length) / SONGS_PER_PAGE);

            const currentSong = `Teraz gra: ${songToStringDisplay(songs.shift())}\n\n`;
            const songsSliced = songs.slice((stage * SONGS_PER_PAGE), (stage * SONGS_PER_PAGE) + SONGS_PER_PAGE);

            const songsStringArr = songsSliced.map((song, index) => `${(index + (stage * SONGS_PER_PAGE) + 1)}. ${songToStringDisplay(song)}`);

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

            const content: InteractionReplyOptions | InteractionUpdateOptions = {
                embeds: [
                    {
                        title: `Kolejka ${loopEmoji}`,
                        description: `${stage === 0 ? currentSong : ''}${songsStringArr.join('\n\n')}`,
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
                                label: 'Poprzednia',
                                style: ButtonStyle.Secondary,
                                disabled: stage <= 0,
                            },
                            {
                                type: ComponentType.Button,
                                customId: `noid`,
                                label: `${stage + 1}/${pages}`,
                                style: ButtonStyle.Secondary,
                                disabled: true,
                            },
                            {
                                type: ComponentType.Button,
                                customId: customIds.next,
                                label: 'Następna',
                                style: ButtonStyle.Secondary,
                                disabled: stage >= pages - 1,
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