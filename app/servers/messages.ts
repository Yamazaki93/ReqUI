import { IMessage } from "../messaging/i-message";
import { ServerConfigMemento } from "./i-server-config";
import { ServerStatus } from "./server-status";
import { IServerError } from "./i-server-error";

// tslint:disable:max-classes-per-file
export class LoadServerRepositoryCommand implements IMessage {
    public ID = 'Servers.Load';
}
export class AddOrUpdateConfigCommand<T extends ServerConfigMemento> implements IMessage {
    public ID = 'Servers.AddOrUpdateConfig';
    public ConfigID: string;
    public Data: T;
    public constructor(
        id: string,
        data: T,
    ) {
        this.ConfigID = id;
        this.Data = data;
    }
}

export class DeleteConfigCommand implements IMessage {
    public ID = 'Servers.DeleteConfig';
    public ConfigID: string;
    public constructor(id: string) {
        this.ConfigID = id;
    }
}

export class ConfigChangedEvent implements IMessage {
    public ID = 'Servers.ConfigChanged';
    public ConfigMementos: ServerConfigMemento[];
    public constructor(
        cs: ServerConfigMemento[],
    ) {
        this.ConfigMementos = cs;
    }
}

export class GetConfigQuery implements IMessage {
    public ID = 'Servers.GetConfig';
    public Key: string;
    public constructor(key: string) {
        this.Key = key;
    }
}

export class GetConfigResponse implements IMessage {
    public ID = 'Servers.GetConfig.Response';
    public Config: ServerConfigMemento;
    public constructor(
        c: ServerConfigMemento,
    ) {
        this.Config = c;
    }
}

export class ServerOpenNewConnectionCommand implements IMessage {
    public ID = 'Servers.OpenNewConnection';
    public ConnectionID: string;
    public Config: ServerConfigMemento;
    public constructor(
        connID: string,
        config: ServerConfigMemento,
    ) {
        this.ConnectionID = connID;
        this.Config = config;
    }
}

export class ServerCloseConnectionCommand implements IMessage {
    public ID = 'Servers.CloseConnection';
    public ConnectionID: string;
    public constructor(
        connID: string,
    ) {
        this.ConnectionID = connID;
    }
}


export class ServerStatusChanged implements IMessage {
    public ID = 'Servers.StatusChanged';
    public ServerID: string;
    public Status: ServerStatus;
    public constructor(
        serverID: string,
        status: ServerStatus,
    ) {
        this.ServerID = serverID;
        this.Status = status;
    }
}

export class ServerResponseReceived implements IMessage {
    public ID = 'Servers.ResponseReceived';
    public ServerID: string;
    public Data: any;
    public constructor(
        serverID: string,
        data: any,
    ) {
        this.ServerID = serverID;
        this.Data = data;
    }
}
export class ServerRequestErrorReceived implements IMessage {
    public ID = 'Servers.RequestErrorReceived';
    public ServerID: string;
    public Error: IServerError;
    public constructor(
        serverID: string,
        error: IServerError,
    ) {
        this.ServerID = serverID;
        this.Error = error;
    }
}
export class ServerSendRequestCommand implements IMessage {
    public ID = 'Servers.SendRequest';
    public ServerID: string;
    public Data: any;
    public constructor(
        serverID: string,
        data: any,
    ) {
        this.ServerID = serverID;
        this.Data = data;
    }
}
