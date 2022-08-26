import { ActionRowBuilder, ComponentType, SelectMenuBuilder } from 'discord.js';
import { RepeatMode } from 'distube';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'loop',
    description: 'Zapętl piosenkę lub kolejkę',
    vcOnly: true,
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));


        const customId = client.utils.generateCustomId('loopselect', interaction);

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .addOptions(
                        {
                            label: 'Piosenka',
                            value: 'song',
                            emoji: '🔂',
                        },
                        {
                            label: 'Kolejka',
                            value: 'queue',
                            emoji: '🔁',
                        },
                        {
                            label: 'Wyłączone',
                            value: 'loopoff',
                            emoji: '🚫',
                        },
                    )
                    .setMaxValues(1)
                    .setCustomId(customId)                    
            );

        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, filter: (c => c.customId === customId), time: 60_000, max: 1, });

        collector.on('collect', selectMenuInteraction => {
            const [selected] = selectMenuInteraction.values;

            if (selected === 'song') {
                client.distube.setRepeatMode(interaction.guildId, RepeatMode.SONG);
                selectMenuInteraction.update({ content: ':repeat_one: Włączono zapętlanie piosenki!', components: [] });
            }
            else if (selected === 'queue') {
                client.distube.setRepeatMode(interaction.guildId, RepeatMode.QUEUE);
                selectMenuInteraction.update({ content: ':repeat: Włączono zapętlanie kolejki!', components: [] });
            }
            else {
                client.distube.setRepeatMode(interaction.guildId, RepeatMode.DISABLED);
                selectMenuInteraction.update({ content: 'Wyłączono zapętlanie!', components: [] });
            }
        });

        collector.once('end', (collected, reason) => {
            if (collected.size === 0) interaction.editReply({ content: 'Nie wybrano sposobu zapętlania na czas!', components: [] });
        });

        await interaction.reply({ content: 'Wybierz sposób zapętlania:', components: [row as ActionRowBuilder<SelectMenuBuilder>], })
            .catch((err) => logger.error({err, message: 'Could not reply', }));
    },
});
