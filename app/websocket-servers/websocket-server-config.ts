import { IServerConfig } from "../servers/i-server-config";
import { WebSocketServerConfigMemento } from "./i-websocket-server-config";

export class WebSocketServerConfig implements IServerConfig {
    private data: WebSocketServerConfigMemento;

    public constructor(data: WebSocketServerConfigMemento) {
        if (!data) {
            throw new Error("Data is required");
        }
        if (!data.ID) {
            throw new Error("ID is required");
        }
        if (!data.Path) {
            throw new Error("URL is required");
        }
        this.data = data;
    }

    public get ID(): string {
        return this.data.ID;
    }
    public get FullURL(): string {
        return this.Protocol + this.Path;
    }
    public get Server(): string {
        return this.data.Path.split('/')[0];
    }
    public get Path(): string {
        return this.data.Path;
    }
    public get Protocol(): 'ws://' | 'wss://' {
        return this.data.Secured ? 'wss://' : 'ws://';
    }
    public get Secured(): boolean {
        return this.data.Secured;
    }
    public GetMemento() {
        return this.data;
    }
    public SetMemento(memento: any) {
        this.data = memento;
    }
}
