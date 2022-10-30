import { InteractionType } from 'discord.js';
import { logger } from '..';
import { AutomatedInteraction } from '../structures/AutomatedInteraction';

export default new AutomatedInteraction({
    type: InteractionType.ModalSubmit,
    name: 'eval',
    run: async interaction => {
        let code = interaction.fields.getTextInputValue('code');

        code = `const { client, logger } = __1;\n${code}`;
        try {
            eval(code);
            interaction.reply({ content: 'Wykonano podany kod', ephemeral: true, });
        } catch (err) {
            interaction.reply({ content: `Nie udało się wykonać kodu\n\`\`\`${err}\`\`\``, ephemeral: true, });
            logger.log({ level: 'error', message: `Eval failed: ${err}`, color: 'redBright', });
        }
    },
});