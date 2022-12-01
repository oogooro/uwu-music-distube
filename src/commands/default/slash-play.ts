import { APIEmbed, ApplicationCommandOptionType, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, escapeMarkdown, GuildMember, hyperlink, WebhookEditMessageOptions } from 'discord.js';
import ytsr, { Result, Video } from 'ytsr';
import { SlashCommand } from '../../structures/SlashCommand';
import { client, distube } from '../..';
import config from '../../config';
import { trimString } from '../../utils';
import { LoggerThread } from 'log4uwu';

const play = (interaction: ChatInputCommandInteraction, songUrl: string, logger: LoggerThread, buttonInteraction?: ButtonInteraction) => {
    const position = interaction.options.getBoolean('next') ? 1 : 0;
    let sharedInteractions = distube.interactionShared.get(interaction.guildId);

    if (!sharedInteractions) sharedInteractions = [];

    sharedInteractions.push({ interaction, buttonInteraction });

    distube.interactionShared.set(interaction.guildId, sharedInteractions);
    distube.errorChannel.set(interaction.guildId, interaction.channel);

    const member = interaction.member as GuildMember;
    distube.play(member.voice.channel, songUrl, {
        member,
        position,
    }).catch(err => {
        logger.error(err);

        const content = err.message.toLowerCase().includes('nsfw') ? 'Nie udało się dodać piosenki, bo Youtube nie pozwala odtwarzać piosenek 18+ bez zalogowania się' : 'Coś poszło nie tak i nie można zagrać muzyki ||(skill issue distube)||';

        const embed: APIEmbed = {
            title: 'Wystąpił błąd!',
            color: 0xff0000,
            description: content,
        }

        return interaction.editReply({ embeds: [embed], })
            .catch(err => logger.error(err));
    });
}

export default new SlashCommand({
    data: {
        name: 'play',
        description: 'Gra podaną muzykę z youtube',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'song',
                nameLocalizations: {
                    pl: 'piosenka',
                },
                description: 'Nazwa/link/playlista z youtube',
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'next',
                nameLocalizations: {
                    pl: 'następna',
                },
                description: 'Czy dodać tę piosenkę jako następną w kolejce',
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'skip',
                nameLocalizations: {
                    pl: 'pominąć',
                },
                description: 'Czy pominąć aktualną piosenkę',
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: 'shuffle',
                nameLocalizations: {
                    pl: 'przetasować',
                },
                description: 'Czy przetasować piosenki po dodaniu',
            },
            {
                type: ApplicationCommandOptionType.String,
                name: 'loop',
                nameLocalizations: {
                    pl: 'zapętlanie',
                },
                description: 'W jaki sposób zapętlać',
                choices: [
                    { name: '🔂 Piosenka', value: '1', },
                    { name: '🔁 Kolejka', value: '2', },
                    { name: '🚫 Wyłączone', value: '0', },
                ],
            },
        ],
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        const songQuery = interaction.options.getString('song');
        
        if (!songQuery.startsWith('https://www.youtube.com/') && !songQuery.startsWith('https://youtube.com/') && !songQuery.startsWith('https://youtu.be/')) {
            if (songQuery.startsWith('https://') || songQuery.startsWith('http://')) {
                return interaction.reply({ content: 'Granie z zewnętrznych plików dźwiękowych jeszcze nie jest zaimplementowane!\nComming Soon™', ephemeral: true, })
                    .catch(err => logger.error(err));
            }

            const interactionResponse = await interaction.deferReply();

            const SEARCH_EMBED_ENTRIES_LENGTH = 10;

            let searchVideoResults: Result;

            try {
                const filters = await ytsr.getFilters(songQuery);
                const filterVideos = filters.get('Type').get('Video');

                searchVideoResults = await ytsr(filterVideos.url, { limit: SEARCH_EMBED_ENTRIES_LENGTH + 5, });
            } catch (err) {
                logger.error(err);
                return interaction.editReply({ content: 'Coś poszło nie tak i nie udało się wyszukać piosenek!', })
                    .catch(err => logger.error(err));
            }

            if (!searchVideoResults.results)
                return interaction.editReply({ content: 'Nie udało się znaleźć podanej piosenki', }).catch(err => logger.error(err));

            const videos = searchVideoResults.items.filter(i => i.type === 'video').splice(0, SEARCH_EMBED_ENTRIES_LENGTH) as Video[];

            let description = ``;
            videos.forEach((item: Video, index) => {
                description += `${index + 1} ${hyperlink(escapeMarkdown(trimString(item.title, 55).replaceAll(/\[|\]|\(|\)/g, '')), item.url, item.title.length >= 55 ? escapeMarkdown(item.title) : null)} - \`${item.duration}\`\n- ${escapeMarkdown(item.author.name)}\n\n`;
            });

            const replyContent = {
                embeds: [{
                    title: `Wyniki wyszukiwania dla: ${searchVideoResults.correctedQuery}`,
                    description,
                    color: config.embedColor,
                }],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [],
                    },
                ],
            }

            videos.forEach((video, index) => { // i hate my life hornesly
                if (index < 5) replyContent.components[0].components.push({
                    type: ComponentType.Button,
                    label: (++index).toString(),
                    customId: index.toString(),
                    style: ButtonStyle.Secondary,
                });
                else replyContent.components[1].components.push({
                    type: ComponentType.Button,
                    label: (++index).toString(),
                    customId: index.toString(),
                    style: ButtonStyle.Secondary,
                });
            });

            replyContent.components[2].components.push({
                type: ComponentType.Button,
                label: 'Anuluj',
                customId: 'CANCEL',
                style: ButtonStyle.Danger,
            });

            interaction.editReply(replyContent).catch(err => logger.error(err));

            const awaitFilter = (i: ButtonInteraction): boolean => {
                if (i.user.id === interaction.user.id) return true;
                else {
                    i.reply({ content: 'Nie możesz użyć tego przycisku!', ephemeral: true });
                    return false;
                }
            }

            interactionResponse.awaitMessageComponent({ componentType: ComponentType.Button, filter: awaitFilter, time: 60000 /* 1min */ })
                .then(async btnInteraction => {
                    if (btnInteraction.customId === 'CANCEL') return interaction.deleteReply().catch(err => logger.error(err));

                    const selectedSong = videos[parseInt(btnInteraction.customId) - 1];
                    await btnInteraction.deferUpdate()
                        .catch(err => logger.error(err));
                    play(interaction, selectedSong.url, logger, btnInteraction);
                })
                .catch(() => {
                    interaction.editReply({ content: 'Piosenka nie została wybrana na czas!', embeds: [], components: [], })
                        .catch(err => logger.error(err));
                });
            return;
        }

        await interaction.deferReply().catch(err => logger.error(err));
        play(interaction, songQuery, logger,);
    },
});
