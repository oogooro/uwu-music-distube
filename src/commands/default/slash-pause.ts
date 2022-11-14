import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'pause',
        description: 'Pauzowanie i wznawianie odtwarzania',
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error(err));;  
        
        if (queue.paused) {
            distube.resume(interaction.guildId);
            interaction.reply({ content: ':arrow_forward: Wznowiono odtwarzanie!', });
        } else {
            distube.pause(interaction.guildId);
            interaction.reply({ content: ':pause_button: Zapauzowano odtwarzanie!', });
        }
    },
});