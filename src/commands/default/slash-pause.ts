import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'pause',
        description: 'Pauzowanie i wznawianie odtwarzania',
        dmPermission: false,
    },
    vcOnly: true,
    queueRequired: true,
    run: async ({ interaction, logger, queue }) => {
        if (queue.paused) {
            distube.resume(interaction.guildId);
            interaction.reply({ content: ':arrow_forward: Wznowiono odtwarzanie!', });
        } else {
            distube.pause(interaction.guildId);
            interaction.reply({ content: ':pause_button: Zapauzowano odtwarzanie!', });
        }
    },
});