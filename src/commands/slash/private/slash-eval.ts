import { ComponentType, ModalComponentData, TextInputStyle } from 'discord.js';
import { SlashCommand } from '../../../structures/Command';
import { client, logger } from '../../..';

export default new SlashCommand({
    name: 'eval',
    description: '[DEV] eval',
    dev: true,
    run: async ({ interaction, }) => {
        const modal: ModalComponentData = {
            title: 'Eval',
            customId: client.utils.generateCustomId('modal', interaction),
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: 'code',
                            label: 'Kod',
                            required: true,
                            style: TextInputStyle.Paragraph,
                            placeholder: 'console.log(\'Hello world!\');',
                        },
                    ],
                },
            ],
        }

        interaction.showModal(modal);

        interaction.awaitModalSubmit({ filter: m => m.customId === modal.customId, time: 300_000 /*5min*/ })
            .then(modalInteraction => {
                const code = modalInteraction.fields.getTextInputValue('code');
                try {
                    eval(code);
                    modalInteraction.reply({ content: 'Wykonano podany kod', ephemeral: true, });
                } catch (err) {
                    modalInteraction.reply({ content: `Nie udało się wykonać kodu\n\`\`\`${err}\`\`\``, ephemeral: true, });
                    logger.log({ level: 'error', message: `Eval failed: ${err}`, color: 'redBright', });
                }
            })
            .catch(err => logger.warn({ message: 'Eval time przekroczony', }));
    },
});