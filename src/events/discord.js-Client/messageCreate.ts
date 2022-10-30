import { client } from '../..';
import { DjsClientEvent } from '../../structures/DjsClientEvent';

export default new DjsClientEvent('messageCreate', async message => {
    if (message.author.bot) return;
    
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`)
        return message.reply({ content: `Witaj, jestem botem! Użyj \`/\`, aby przeglądać moje komendy!`, allowedMentions: { parse: [], }, });
});