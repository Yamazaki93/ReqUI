export interface ILogger {
    SetLoggerMode(debug: boolean);
    debug(log: string);
    verbose(log: string);
    info(log: string);
    warn(log: string);
    error(log: string);
}
