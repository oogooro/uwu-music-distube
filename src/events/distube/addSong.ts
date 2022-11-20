import { client, distube, logger } from '../..';
import config from '../../config';
import { DistubeEvent } from '../../structures/DistubeEvent';
import { songToDisplayString } from '../../utils';

export default new DistubeEvent(
    'addSong',
    async (queue, song) => {
        const sharedInteractions = distube.interactionShared.get(queue.id);
        const { interaction, buttonInteraction } = sharedInteractions.shift();

        distube.interactionShared.set(queue.id, sharedInteractions);

        let additionalInfo: string[] = [];
        if (interaction.isChatInputCommand()) {
            const position = interaction.options.getBoolean('next') ? 1 : 0;
            const skip = interaction.options.getBoolean('skip');
            const shuffle = interaction.options.getBoolean('shuffle');
            const loopMode = interaction.options.getString('loop');

            if (skip) {
                if (!queue || !queue.songs[1]) return;
                distube.skip(interaction.guildId);
                additionalInfo.push('Pominięto');
            }
            if (shuffle) {
                if (!queue || !queue.songs[1]) return;
                distube.shuffle(interaction.guildId);
                additionalInfo.push('Przetasowano');
            }
            if (loopMode) {
                queue.setRepeatMode(parseInt(loopMode));
                if (loopMode === '0') additionalInfo.push('Wyłączono zapętlanie');
                if (loopMode === '1') additionalInfo.push('Włączono zapętlanie piosenki');
                if (loopMode === '2') additionalInfo.push('Włączono zapętlanie kolejki');
            }
            if (position) additionalInfo.push('Dodano jako następna piosenka');
        }

        let description = songToDisplayString(song);

        if (additionalInfo.length) description += '\n\n' + additionalInfo.join('\n');

        const replyContent = {
            embeds: [{
                title: 'Dodano',
                thumbnail: {
                    url: song.thumbnail,
                },
                description,
                color: config.embedColor,
            }],
            components: [],
        }

        if (buttonInteraction) buttonInteraction.editReply(replyContent).catch(err => logger.error(err));
        else interaction.editReply(replyContent).catch(err => logger.error(err));
    }
);