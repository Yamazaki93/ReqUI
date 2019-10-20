import { IMemorable } from '../persistence/i-memorable';

export interface IServerConfig extends IMemorable {
    ID: string;
}

export class ServerConfigMemento {
    public ID: string;
    public TypeID: string;
}
