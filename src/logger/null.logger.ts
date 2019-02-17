import { LoggerInterface } from './logger.interface';

export class NullLogger implements LoggerInterface {
    debug(): any {
        //
    }
    info(): any {
        //
    }
    warn(): any {
        //
    }
    error(): any {
        //
    }
}
