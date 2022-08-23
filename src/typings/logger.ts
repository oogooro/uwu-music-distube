import { Chalk } from 'chalk';
import { WriteStream } from 'node:fs';

export interface LoggerOptions {
    disableWriteStreams?: boolean;
    logDir?: string;
}

export interface LogWriteStreams {
    latest: WriteStream;
    history: WriteStream;
}

export type LogLevel = 'info' | 'init' | 'debug' | 'error' | 'warn';
export type LogColor = string | Chalk;

export interface LogOptions {
    level: LogLevel;
    message: string;
    color?: LogColor;
    silent?: boolean;
}

export interface OtherOptions {
    message: string;
    color?: LogColor;
    silent?: boolean;
}

export interface ErrorOptions {
    message: string;
    err: Error;
    color?: LogColor;
    silent?: boolean;
}