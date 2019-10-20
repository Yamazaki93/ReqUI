import * as electronLog from "electron-log";
import { ILogger } from "./i-logger";


export class Logger implements ILogger {
    public constructor(appDir: string) {
        electronLog.transports.console.level = false;
        electronLog.transports.file.level = 'silly';
        electronLog.transports.file.file = `${appDir}/log.txt`;
        electronLog.transports.file.maxSize = 10485760;  // 10mb in bytes;
    }
    public SetLoggerMode(debug: boolean) {
        debug = (process.mainModule.filename.indexOf('app.asar') === -1) || debug;
        if (debug) {
            electronLog.transports.file.level = "debug";
        } else {
            electronLog.transports.file.level = "verbose";
        }
        this.info(`Logger - log level set to ${electronLog.transports.file.level}`);
    }
    public debug(log: string) {
        electronLog.debug(log);
    }
    public verbose(log: string) {
        electronLog.verbose(log);
    }
    public info(log: string) {
        electronLog.info(log);
    }
    public warn(log: string) {
        electronLog.warn(log);
    }
    public error(log: string) {
        electronLog.error(log);
    }
}
