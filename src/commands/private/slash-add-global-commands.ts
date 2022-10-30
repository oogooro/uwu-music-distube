import { client } from "../..";
import { SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    data: {
        name: 'update-global-commands',
        description: '[DEV] Globalne dodawanie komend',
    },
    dev: true,
    run: async ({ interaction, }) => {
        await interaction.deferReply({ ephemeral: true, });

        client.registerCommandsGlobally(client.commands.payload.global)
            .then(() => { interaction.followUp({ content: 'Zaktualizowano globalne komendy', })})
            .catch(err => { interaction.followUp({ content: 'Nie udało się zarejestorwać komend globalnych', }); });
    },
});