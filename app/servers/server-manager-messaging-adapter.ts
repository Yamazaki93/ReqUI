import { IMessenger } from "../messaging/i-messenger";
import { ServerConnectionManager } from "./server-connection";
import { ServerOpenNewConnectionCommand, ServerCloseConnectionCommand, ServerSendRequestCommand } from "./messages";
import { ConfigFactory } from "../config-factory";

export class ServerManagerMessagingAdapter {
    public constructor(
        private svc: ServerConnectionManager,
        private messenger: IMessenger,
    ) {
        messenger.Receive('Servers.OpenNewConnection', (m: ServerOpenNewConnectionCommand) => {
            this.OnOpenNewConnection(m);
        });
        messenger.Receive('Servers.CloseConnection', (m: ServerCloseConnectionCommand) => {
            this.OnCloseConnection(m);
        });
        messenger.Receive('Servers.SendRequest', (m: ServerSendRequestCommand) => {
            this.OnSendRequest(m);
        });
    }
    private OnOpenNewConnection(cmd: ServerOpenNewConnectionCommand) {
        let cfg = ConfigFactory.CreateConfigObject(cmd.Config);
        this.svc.CreateNewServer(cmd.ConnectionID, cfg);
    }
    private OnCloseConnection(cmd: ServerCloseConnectionCommand) {
        this.svc.CloseServer(cmd.ConnectionID);
    }
    private OnSendRequest(cmd: ServerSendRequestCommand) {
        this.svc.SendRequest(cmd.ServerID, cmd.Data);
    }
}
