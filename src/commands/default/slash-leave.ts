import { SlashCommand } from '../../structures/SlashCommand';
import { client, distube } from '../..';

export default new SlashCommand({
    data: {
        name: 'leave',
        description: 'Odłącza z kanału głosowego',
        dmPermission: false,
    },
    run: async ({ interaction, logger }) => {
        if (distube.getQueue(interaction.guildId)) distube.stop(interaction.guildId);
        const voice = distube.voices.get(interaction.guildId);

        if (!voice) return interaction.reply({ content: 'Już jestem odłączony!', ephemeral: true, }).catch(err => logger.error(err));

        voice.connection.destroy();
        
        interaction.reply({ content: 'Odłączono!', }).catch(err => logger.error(err));
    },
}); 