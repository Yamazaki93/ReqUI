import { WebSocketServerConfig } from './websocket-servers/websocket-server-config';
import { ServerConfigMemento } from './servers/i-server-config';

export class ConfigFactory {
    public static CreateConfigObject(data: ServerConfigMemento): any {
        if (!data.TypeID) {
            throw new Error('TypeID is required');
        }
        switch (data.TypeID) {
            case 'WebSocket':
                let t = new WebSocketServerConfig({ID: '0', TypeID: 'WebSocket', Secured: false, Path: '0'});
                t.SetMemento(data);
                return t;
            default:
                throw new Error('Unknown config type');
        }
    }
}
