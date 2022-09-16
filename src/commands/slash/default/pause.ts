import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'pause',
    description: 'Pauzowanie i wznawianie odtwarzania',
    vcOnly: true,
    dmPermission: false,
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));
        
        if (queue.paused) {
            client.distube.resume(interaction.guildId);
            interaction.reply({ content: ':arrow_forward: Wznowiono odtwarzanie!', });
        } else {
            client.distube.pause(interaction.guildId);
            interaction.reply({ content: ':pause_button: Zapauzowano odtwarzanie!', });
        }
    },
});