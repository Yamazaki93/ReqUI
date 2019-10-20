import { IServerConstructor } from "./i-server";

export interface IServerManager {
    RegisterType(key: string, cls: IServerConstructor);
}
