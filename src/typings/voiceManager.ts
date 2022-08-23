import { VoiceConnection } from "@discordjs/voice";
import { Collection, GuildMember } from "discord.js";

interface song {
    url: string,
    title: string,
    length?: number,
    addedBy: GuildMember,
}

interface voiceConfig {
    queue?: song[],
    connection: VoiceConnection,
}

export type voiceManager = Collection<string, voiceConfig>;
