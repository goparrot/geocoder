export interface LoggerInterface {
    debug(message: string, meta?: any): any;
    info(message: string, meta?: any): any;
    warn(message: string, meta?: any): any;
    error(message: string, meta?: any): any;
}
