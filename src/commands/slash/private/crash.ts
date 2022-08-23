import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'crash',
    description: 'uh oh stinky',
    dev: true,
    run: async ({ interaction, }) => {
        throw new Error('kontrolowany crash');
    },
});