import { IPersistenceService } from "../persistence/i-persistence";
import { IServerConfig, ServerConfigMemento } from "./i-server-config";
import { ConfigFactory } from "../config-factory";

export class ServerConfigRepository {
    private configs: IServerConfigDict = {};
    private persistenceKey = "ServerConfig";
    public constructor(
        private persistence: IPersistenceService,
    ) { }
    public AddOrUpdateConfig(config: ServerConfigMemento) {
        this.configs[config.ID] = ConfigFactory.CreateConfigObject(config);
        this.SaveAll();
    }
    public DeleteConfig(key: string) {
        delete this.configs[key];
        this.SaveAll();
    }
    public GetConfig(key: string) {
        this.GetAll();
        if (!this.configs[key]) {
            throw new Error("Config does not exist");
        }
        return this.configs[key];
    }
    public GetAllConfigs() {
        this.GetAll();
        return Object.keys(this.configs).map(_ => {
            return this.configs[_].GetMemento();
        });
    }

    private SaveAll() {
        let mem = {};
        Object.keys(this.configs).forEach(k => {
            mem[k] = this.configs[k].GetMemento();
        });
        this.persistence.Set(this.persistenceKey, mem);
    }
    private GetAll() {
        let mem = this.persistence.Get<any>(this.persistenceKey);
        this.configs = {};
        if (!mem) {
            return;
        }
        Object.keys(mem).forEach(k => {
            this.configs[k] = ConfigFactory.CreateConfigObject(mem[k]);
        });
    }
}

declare interface IServerConfigDict {
    [key: string]: IServerConfig;
}
