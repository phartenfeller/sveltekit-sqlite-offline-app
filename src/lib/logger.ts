/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';

const LEVELS: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'];

export default class Logger {
	private static instance: Logger;
	private logLevel: LogLevel;

	private constructor() {
		const storedLogLevel = sessionStorage.getItem('logLevel');

		if (storedLogLevel && this.isValidLogLevel(storedLogLevel as LogLevel)) {
			this.logLevel = storedLogLevel as LogLevel;
		} else {
			this.logLevel = 'INFO'; // Default log level
			sessionStorage.setItem('logLevel', this.logLevel);
		}
	}

	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}

		return Logger.instance;
	}

	public getAllLevels(): LogLevel[] {
		return LEVELS;
	}

	public getLevel(): LogLevel {
		return this.logLevel;
	}

	private isValidLogLevel(logLevel: LogLevel): boolean {
		return LEVELS.includes(logLevel);
	}

	private shouldLog(level: LogLevel): boolean {
		return LEVELS.indexOf(level) >= LEVELS.indexOf(this.logLevel);
	}

	public debug(message: string, ...args: any[]): void {
		if (this.shouldLog('DEBUG')) {
			console.debug(`[DEBUG]: ${message}`, ...args);
		}
	}

	public info(message: string, ...args: any[]): void {
		if (this.shouldLog('INFO')) {
			console.info(`[INFO]: ${message}`, ...args);
		}
	}

	public warn(message: string, ...args: any[]): void {
		if (this.shouldLog('WARN')) {
			console.warn(`[WARN]: ${message}`, ...args);
		}
	}

	public error(message: string, ...args: any[]): void {
		if (this.shouldLog('ERROR')) {
			console.error(`[ERROR]: ${message}`, ...args);
		}
	}

	public setLogLevel(level: LogLevel): void {
		if (this.isValidLogLevel(level)) {
			this.logLevel = level;
			this.info(`Log level set to ${level}`);
			sessionStorage.setItem('logLevel', level);
		} else {
			throw new Error(`Invalid log level: ${level}`);
		}
	}

	public getLogLevel(): LogLevel {
		return this.logLevel;
	}
}
