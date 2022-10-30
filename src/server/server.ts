import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { join } from 'path';
import { client, logger } from '..';
import { botSettingsDB } from '../structures/Database';
import { ActivityType } from 'discord.js';

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

const serverPagesPath = join(__dirname, '../../', 'serverPages')

app.use('/', express.static(join(serverPagesPath, 'public')));

app.get('/', (req, res) => {
    res.sendFile(join(serverPagesPath, 'index.html'));
});

app.get('/api/:endpoint/:options?', (req, res) => {
    const { endpoint, options } = req.params;

    switch (endpoint) {
        case 'botInfo':
            if(options) {
                switch (options) {
                    case 'commands':
                        res.send(client.commands.payload);
                        break;
                    case 'guilds':
                        res.send(client.guilds.cache);
                        break;
                    case 'users':
                        res.send(client.users.cache);
                        break;
                    case 'user':
                        res.send(client.user);
                        break;
                    case 'settings':
                        res.send(botSettingsDB.get('settings'));
                        break;
                
                    default:
                        res.status(404).send({ message: 'endpoint option not found' });
                        break;
                }
            }
            else {
                res.send({
                    user: client.user,
                    ping: client.ws.ping,
                    uptime: client.uptime,
                    commands: client.commands.payload,
                    guilds: client.guilds.cache,
                    users: client.users.cache,
                });
            }
            break;
            
        default:
            res.status(404).send({ message: 'endpoint not found' });
            break;
    }
});

interface Settings {
    online: boolean;
    status: {
        visible: boolean;
        data: [
            {
                name: string;
                type: ActivityType.Playing | ActivityType.Listening | ActivityType.Watching;
            }
        ];
    };
}

io.on('connection', (socket) => {
    socket.on('manageChangeSettings', (settings: Settings) => {
        const config = botSettingsDB.get('settings');

        botSettingsDB.set('settings', { ...config, ...settings });
        client.updatePresence();
    });

    socket.on('buttonClick', (button) => {
        if (button === 'global') client.registerCommandsGlobally(client.commands.payload.global).catch(err => logger.error({ err, message: 'Could not register global commands' }));
        else client.registerCommands(client.commands.payload.allCommands, process.env.BOT_GUILD_ID, false).catch(err => logger.error({ err, message: 'Could not register commands' }));
    });
});

server.listen(process.env.PORT, () => {
    logger.log({
        level: 'init',
        message: `Started server at port ${process.env.PORT}`,
        color: 'cyan'
    });
});