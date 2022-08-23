import moment from 'moment';
import fs from 'node:fs';
import chalk from 'chalk';
import { ErrorOptions, LoggerOptions, LogOptions, LogWriteStreams, OtherOptions } from '../typings/logger';

export class Logger {
    private dateString = moment(new Date()).format('D-M-YY-HH-mm-ss');
    private writeDisabled: boolean;
    private logDir: string;
    private writeStreams: LogWriteStreams;

    constructor(settings: LoggerOptions) {
        this.logDir = settings?.logDir || `${__dirname}/../../logs`;
        this.writeDisabled = settings?.disableWriteStreams || false;

        this.writeStreams = {
            latest: fs.createWriteStream(`${this.logDir}/latest.log`),
            history: fs.createWriteStream(`${this.logDir}/${this.dateString}-history.log`),
        }

        if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir);
        if (fs.existsSync(`${this.logDir}/latest.log`)) fs.rmSync(`${this.logDir}/latest.log`);
    }

    log({ level, message, color, silent, }: LogOptions) {
        let prefix = '';
        if (level == 'info') prefix = `[${chalk.greenBright('INFO')}]`;
        else if (level == 'init') prefix = `[${chalk.whiteBright('INIT')}]`;
        else if (level == 'debug') prefix = `[${chalk.cyanBright('DEBUG')}]`;
        else if (level == 'error') prefix = `[${chalk.redBright('ERROR')}]`;
        else if (level == 'warn') prefix = `[${chalk.yellowBright('WARN')}]`;

        const logDate = new Date();
        if (!silent) {
            if (typeof color === 'function') process.stdout.write(`${prefix} ${color(message)}\n`);
            else if (chalk[color]) process.stdout.write(`${prefix} ${chalk[color](message)}\n`);
            else process.stdout.write(`${prefix} ${message}\n`);
        }

        if (!this.writeDisabled) {
            this.writeStreams.latest.write(`[${moment(logDate).format('HH:mm:ss')}] - ${level.toUpperCase()} - ${message}\n`);
            this.writeStreams.history.write(`[${moment(logDate).format('HH:mm:ss')}] - ${level.toUpperCase()} - ${message}\n`);
        }

        return message;
    }

    debug({ message, color, silent = true }: OtherOptions) {
        if (process.env.debug === '1' || process.env.environment === 'debug') silent = false;

        return this.log({
            level: 'debug',
            message, color, silent,
        });
    }

    warn({ message, color, silent = false }: OtherOptions) {
        return this.log({
            level: 'warn',
            message,
            color: color || chalk.yellowBright,
            silent,
        });
    }

    error({ message, err, color, silent }: ErrorOptions) {
        message += `; ${err.stack}`;
        return this.log({
            level: 'error',
            message,
            color: color || chalk.redBright,
            silent,
        });
    }
}