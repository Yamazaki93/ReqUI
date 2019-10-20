import { ServerConfigRepository } from "./server-config-repository";
import { IMessenger } from "../messaging/i-messenger";
import { ConfigChangedEvent, LoadServerRepositoryCommand, AddOrUpdateConfigCommand, GetConfigQuery, GetConfigResponse, DeleteConfigCommand } from "./messages";
import { ServerConfigMemento } from "./i-server-config";

export class ServerConfigRepositoryMessagingAdapter {
    public constructor(
        private repo: ServerConfigRepository,
        private messenger: IMessenger,
    ) {
        messenger.Receive('Servers.AddOrUpdateConfig', (m: AddOrUpdateConfigCommand<any>) => {
            this.OnAddConfig(m);
        });
        messenger.HandleRequest('Servers.GetConfig', (m: GetConfigQuery) => {
            return this.OnGetConfig(m);
        });
        messenger.Receive('Servers.Load', (m: LoadServerRepositoryCommand) => {
            this.OnLoadServerCommand(m);
        });
        messenger.Receive('Servers.DeleteConfig', (m: DeleteConfigCommand) => {
            this.OnDeleteConfig(m);
        });
    }
    private OnDeleteConfig(c: DeleteConfigCommand) {
        this.repo.DeleteConfig(c.ConfigID);
        this.messenger.Send(new ConfigChangedEvent(this.repo.GetAllConfigs()));
    }
    private OnLoadServerCommand(c: LoadServerRepositoryCommand) {
        this.messenger.Send(new ConfigChangedEvent(this.repo.GetAllConfigs()));
    }
    private OnAddConfig(c: AddOrUpdateConfigCommand<ServerConfigMemento>) {
        this.repo.AddOrUpdateConfig(c.Data);
        this.messenger.Send(new ConfigChangedEvent(this.repo.GetAllConfigs()));
    }
    private OnGetConfig(c: GetConfigQuery) {
        let cfg = this.repo.GetConfig(c.Key);
        return new GetConfigResponse(cfg.GetMemento());
    }
}
