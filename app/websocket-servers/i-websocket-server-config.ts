import { ServerConfigMemento } from '../servers/i-server-config';

export class WebSocketServerConfigMemento extends ServerConfigMemento {
    public Path: string;
    public Secured: boolean;
}
