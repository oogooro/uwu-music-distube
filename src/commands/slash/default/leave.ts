import { SlashCommand } from '../../../structures/Command';
import { client } from '../../..';

export default new SlashCommand({
    name: 'leave',
    description: 'Odłącza z kanału głosowego',
    run: async ({ interaction }) => {
        client.distube.stop(interaction.guildId);
        interaction.reply({ content: 'Odłączono!', });
    },
}); 