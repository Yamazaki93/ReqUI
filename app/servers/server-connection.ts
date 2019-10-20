import { IServerManager } from "./i-server-manager";
import { IServerConstructor, IServer } from "./i-server";
import { ILogger } from "../logging/i-logger";
import { IServerConfig } from "./i-server-config";
import { IMessenger } from "../messaging/i-messenger";
import { Subscription } from "rxjs";
import { ServerStatusChanged, ServerResponseReceived, ServerRequestErrorReceived } from "./messages";

export class ServerConnectionManager implements IServerManager {
    private registeredTypes: {
        [key: string]: IServerConstructor;
    } = {};
    private activeConnections: {
        [key: string]: IServer<any, any>;
    } = {};
    private statusSubscriptions: {
        [key: string]: Subscription;
    } = {};
    private errorSubscriptions: {
        [key: string]: Subscription;
    } = {};
    private respSubscriptions: {
        [key: string]: Subscription;
    } = {};
    public constructor(
        private log: ILogger,
        private messenger: IMessenger,
    ) {
    }
    public RegisterType(key: string, cls: IServerConstructor) {
        this.log.debug(`Servers.ServerManager - Registering type ${cls} with ${key}`);
        this.registeredTypes[key] = cls;
    }
    public CreateNewServer(id: string, cfg: IServerConfig) {
        if (!this.registeredTypes[cfg.GetMemento().TypeID]) {
            let msg = `Servers.ServerManager - Cannot resolve TypeID ${cfg.GetMemento().TypeID}, the corresponding server is not registered`;
            this.log.error(msg);
            throw new Error(msg);
        }
        if (this.activeConnections[id]) {
            let msg = `Servers.ServerManager - Cannot open new connection, id already exists`;
            this.log.error(msg);
            throw new Error(msg);
        }
        let server = new this.registeredTypes[cfg.GetMemento().TypeID](cfg, this.log);
        this.log.debug(`Servers.ServerManager - New server created for ${cfg.GetMemento().TypeID}`);
        this.SubscribeForServerStatus(id, server);
        this.SubscriveForServerResponse(id, server);
        this.SubscriptForError(id, server);
        this.activeConnections[id] = server;
        server.Open();
    }
    public CloseServer(id: string) {
        if (this.activeConnections[id]) {
            this.activeConnections[id].Close();
            this.statusSubscriptions[id].unsubscribe();
            delete this.statusSubscriptions[id];
            this.respSubscriptions[id].unsubscribe();
            this.errorSubscriptions[id].unsubscribe();
            delete this.errorSubscriptions[id];
            delete this.respSubscriptions[id];
            delete this.activeConnections[id];
        }
    }
    public SendRequest(id: string, data: any) {
        if (this.activeConnections[id]) {
            this.activeConnections[id].Send(data);
        } else {
            let msg = `Servers.ServerManager - Cannot find connection with id ${id}`;
            this.log.error(msg);
            throw new Error(msg);
        }
    }
    private SubscriveForServerResponse(id: string, server: IServer<any, any>) {
        this.respSubscriptions[id] = server.Receive().subscribe(cs => {
            this.messenger.Send(new ServerResponseReceived(id, cs));
        });
    }
    private SubscribeForServerStatus(id: string, server: IServer<any, any>) {
        this.statusSubscriptions[id] = server.CurrentStatus().subscribe(cs => {
            this.messenger.Send(new ServerStatusChanged(id, cs));
        });
    }
    private SubscriptForError(id: string, server: IServer<any, any>) {
        this.errorSubscriptions[id] = server.OnError().subscribe(cs => {
            this.messenger.Send(new ServerRequestErrorReceived(id, cs));
        });
    }
}
