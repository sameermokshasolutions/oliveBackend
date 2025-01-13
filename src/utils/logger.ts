type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LoggerOptions {
  level?: LogLevel;
}

class Logger {
  private level: LogLevel;
  private readonly levels: Record<LogLevel, number>;
  private readonly colors: Record<LogLevel, string>;
  private readonly resetColor: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m', // Yellow
      info: '\x1b[36m', // Cyan
      debug: '\x1b[90m', // Gray
    };
    this.resetColor = '\x1b[0m';
  }

  private log(level: LogLevel, message: string): void {
    if (this.levels[level] <= this.levels[this.level]) {
      const timestamp = new Date().toISOString();
      const coloredLevel = `${this.colors[level]}${level.toUpperCase()}${this.resetColor}`;
      console.log(`{ Timestamp: ${timestamp}, ${coloredLevel}: ${message} }`);
    }
  }

  public setLevel(newLevel: LogLevel): void {
    if (this.levels[newLevel] !== undefined) {
      this.level = newLevel;
    } else {
      throw new Error(`Invalid log level: ${newLevel}`);
    }
  }

  public error(message: string): void {
    this.log('error', message);
  }

  public warn(message: string): void {
    this.log('warn', message);
  }

  public info(message: string): void {
    this.log('info', message);
  }

  public debug(message: string): void {
    this.log('debug', message);
  }
}

// Create a logger instance
const logger = new Logger({ level: 'info' });

export default logger;
