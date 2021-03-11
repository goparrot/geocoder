import type { LoggerInterface } from './logger.interface';

export interface LoggableInterface {
    setLogger(logger: LoggerInterface): this;

    getLogger(): LoggerInterface;
}
