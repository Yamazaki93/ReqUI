import { BrowserWindow, ipcMain } from "electron";
import { IMessenger } from '../messaging/i-messenger';
import { ILogger } from "../logging/i-logger";
import { IMessage } from "./i-message";

export class Messenger implements IMessenger {

    private registrations: {
        [key: string]: Array<(payload: IMessage) => void>,
    };
    private syncRegistrations: {
        [key: string]: (payload: IMessage) => any,
    };
    private windows: BrowserWindow[] = [];
    private logger: ILogger;
    private debugMode = false;
    public constructor(logger: ILogger, debugMode = false) {
        this.syncRegistrations = {};
        this.registrations = {};
        this.logger = logger;
        this.debugMode = debugMode;
        if (ipcMain) {
            ipcMain.on('SocketUI', (event, arg) => {
                let unpackedMessage = arg.id;
                let unpackedPayload = arg.payload;
                this.logger.verbose(`Messenger - Receive ipc message ${JSON.stringify(arg)}`);
                if (this.registrations[unpackedMessage]) {
                    this.registrations[unpackedMessage].forEach(f => {
                        try {
                            f(unpackedPayload);
                        } catch (err) {
                            this.logger.error('Messenger - Error ' + err);
                            if (debugMode) {
                                throw err;
                            }
                        }
                    });
                }
                if (this.syncRegistrations[unpackedMessage]) {
                    try {
                        event.returnValue = this.syncRegistrations[unpackedMessage](unpackedPayload);
                    } catch (err) {
                        this.logger.error('Messenger - Error ' + err);
                        if (debugMode) {
                            throw err;
                        }
                    }
                }
            });
        }
    }
    public addWindow(win: BrowserWindow) {
        this.logger.verbose('Messenger - Initializing window');
        this.windows.push(win);
    }
    public removeWindow(win: BrowserWindow) {
        this.logger.verbose('Messenger - Removing window');
        if (this.windows.indexOf(win) >= 0) {
            this.windows.splice(this.windows.indexOf(win), 1);
        }
    }
    public Send<T extends IMessage>(message: T) {
        this.logger.verbose(`Messenger - Send message ${JSON.stringify(message)}`);
        if (this.registrations[message.ID]) {
            this.registrations[message.ID].forEach(f => {
                setTimeout(() => {
                    try {
                        f(message);
                    } catch (err) {
                        this.logger.error('Messenger - Error ' + err);
                        if (this.debugMode) {
                            throw err;
                        }
                    }
                });
            });
        }
        if (this.windows.length) {
            this.windows.forEach(w => {
                if (!w.isDestroyed()) {
                    w.webContents.send('SocketUI', { id: message.ID, payload: message });
                }
            });
        }
    }
    public Receive<T extends IMessage>(messageID: string, handler: (payload: T) => void) {
        if (!this.registrations[messageID]) {
            this.registrations[messageID] = [handler];
        } else {
            this.registrations[messageID].push(handler);
        }
    }
    public Request<T extends IMessage, J extends IMessage>(message: T): J {
        this.logger.verbose(`Messenger - Request message ${JSON.stringify(message)}`);
        if (this.syncRegistrations[message.ID]) {
            return this.syncRegistrations[message.ID](message);
        }
        this.logger.error(`Messenger - No handler registered for ${message.ID}`);
        throw new Error("No handler registered");
    }
    public HandleRequest<T extends IMessage, J extends IMessage>(messageID: string, handler: (message: T) => J) {
        if (this.syncRegistrations[messageID]) {
            this.logger.error(`Messenger - Cannot register handler for ${messageID} twice`);
            throw new Error("Cannot register same request handlers twice");
        }
        this.syncRegistrations[messageID] = handler;
    }
    public ClearRegistrations() {
        this.registrations = {};
        if (ipcMain) {
            ipcMain.removeAllListeners('SocketUI');
        }
    }
}
