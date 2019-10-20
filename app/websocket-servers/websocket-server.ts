import * as ws from 'ws';
import { IServer, IRequest } from "../servers/i-server";
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { ServerStatus } from "../servers/server-status";
import { IServerConfig } from "../servers/i-server-config";
import { WebSocketServerConfig } from './websocket-server-config';
import { ILogger } from '../logging/i-logger';
import { IServerError } from '../servers/i-server-error';

export class WebSocketServer implements IServer<WebSocketRequest, WebSocketResponse> {
    private config: WebSocketServerConfig;
    private currentStatus = new BehaviorSubject<ServerStatus>(ServerStatus.Closed);
    private message = new Subject<WebSocketResponse>();
    private svrError = new Subject<IServerError>();
    private svr: ws;
    public constructor(config: IServerConfig, private log: ILogger) {
        this.config = config as WebSocketServerConfig;
    }
    public SetConfig(config: IServerConfig) {
        throw new Error("Method not implemented.");
    }
    public GetConfig(): IServerConfig {
        throw new Error("Method not implemented.");
    }
    public Send(data: WebSocketRequest) {
        try {
            if (!this.svr) {
                this.Open();
            }
            this.svr.send(data);
            // tslint:disable-next-line:no-empty
        } catch (err) {
        }
    }
    public Receive(): Observable<WebSocketResponse> {
        return this.message;
    }
    public CurrentStatus(): Observable<ServerStatus> {
        return this.currentStatus;
    }
    public OnError(): Observable<IServerError> {
        return this.svrError;
    }
    public Close() {
        try {
            this.svr.close();
            this.log.error(`WebSocket.Server - Closed`);
            // tslint:disable-next-line:no-empty
        } catch (err) {
        } finally {
            this.currentStatus.next(ServerStatus.Closed);
            this.svr = undefined;
        }
    }
    public Open() {
        this.currentStatus.next(ServerStatus.Busy);
        try {
            this.svr = new ws(this.config.FullURL);
            this.svr.on('error', (err) => {
                this.Close();
                this.currentStatus.next(ServerStatus.Error);
                this.svrError.next({
                    Message: err.message,
                    Data: err,
                });
                this.log.error(`WebSocket.Server.Error - ${err}`);
            });
            this.svr.on('message', (data) => {
                this.message.next({
                    Data: data.toString(),
                });
            });
            this.svr.on('open', () => {
                this.currentStatus.next(ServerStatus.Normal);
            });
        } catch (err) {
            this.Close();
            this.currentStatus.next(ServerStatus.Error);
            this.log.error(`WebSocket.Server.Error - ${err}`);
            return;
        }
    }
}

// tslint:disable:max-classes-per-file
export class WebSocketRequest implements IRequest {
    public Name: string;
    public Data: string;
    public Type = "WebSocket";
}

export class WebSocketResponse {
    public Data: string;
}
