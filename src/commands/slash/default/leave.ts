import { SlashCommand } from '../../../structures/Command';
import { client } from '../../..';

export default new SlashCommand({
    name: 'leave',
    description: 'Odłącza z kanału głosowego',
    run: async ({ interaction }) => {
        if (client.distube.getQueue(interaction.guildId)) client.distube.stop(interaction.guildId);
        const voice = client.distube.voices.get(interaction.guildId);

        if (!voice) return interaction.reply({ content: 'Już jestem odłączony!', ephemeral: true, }).catch(() => {});

        voice.connection.destroy();
        
        interaction.reply({ content: 'Odłączono!', }).catch(() => {});
    },
}); 