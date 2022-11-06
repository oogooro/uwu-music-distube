import { CommandInteraction, Interaction, InteractionType } from 'discord.js';
import { Song } from 'distube';

let customIdIncrement = 0;
export function generateCustomId(text: string, interaction: CommandInteraction): string {
    if (customIdIncrement >= 100) customIdIncrement = 0;
    customIdIncrement++;
    return `${interaction.commandName}-${text}-${interaction.user.id}-${interaction.createdTimestamp}-${customIdIncrement}`.toUpperCase();
}

export function generateInteractionTrace(interaction: Interaction): string {
    const place = interaction.guildId || 'DM';
    if (interaction.type === InteractionType.ApplicationCommand || interaction.type === InteractionType.ApplicationCommandAutocomplete) return `${place}/${interaction.user.id}/${interaction.commandName}`;
    else if (interaction.type === InteractionType.MessageComponent || interaction.type === InteractionType.ModalSubmit) return `${place}/${interaction.user.id}/${interaction.customId}`;
}

export function songToDisplayString(song: Song): string {
    return `[${song.name}](${song.url}) - \`${song.formattedDuration}\`\n(dodane przez <@${song.user.id}>)`;
}

export function formatTimeDisplay(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 60 / 60);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds - minutes * 60 - hours * 3600);

    function padTo2Digits(num: number): string {
        return num.toString().padStart(2, '0');
    }

    return `${hours ? `${hours}:` : ''}${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

export function trimString(s: string, length: number): string {
    return s.length > length ? s.substring(0, length - 3).trim() + "..." : s;
}