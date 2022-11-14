import { InteractionType } from 'discord.js';
import { AutomatedInteraction } from '../structures/AutomatedInteraction';

export default new AutomatedInteraction({
    type: InteractionType.ModalSubmit,
    name: 'eval',
    run: async ({ interaction, logger }) => {
        let code = interaction.fields.getTextInputValue('code');

        code = `const { client } = __1;\n${code}`;
        try {
            eval(code);
            interaction.reply({ content: 'Wykonano podany kod', ephemeral: true, });
        } catch (err) {
            interaction.reply({ content: `Nie udało się wykonać kodu\n\`\`\`${err}\`\`\``, ephemeral: true, });
            logger.log({ level: 'error', message: `Eval failed: ${err}`, color: 'redBright', });
        }
    },
});